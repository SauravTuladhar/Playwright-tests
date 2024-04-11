const axios = require('axios');
import { expect } from '@playwright/test';
import { json } from 'stream/consumers';
const fs = require('fs');
const path = require('path');


const PRACTITEST_API_KEY = 'f18e175c1920966ccd0ca3ffbaeb7930a0a471ce';
const PROJECT_ID = '28334';
const testSetId = '3722644';
const PRACTITEST_API_URL = `https://api.practitest.com/api/v2/projects/${PROJECT_ID}`;
const GITHUB_TOKEN = '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';
const OWNER = 'sauravtuladhar8square';
const REPO = 'MMP2.0-BO';
const { parse } = require("node-html-parser");

let resetPasswordLink, accessToken, deleteUserId, apiUrl

async function updateRun(instanceId, runStatus, apiResponse) {
    //const absolutePath = path.resolve('playwright-report/index.html');
    //const reportContent = fs.readFileSync(absolutePath, 'base64');
    const gitHubLink = await getLatestGitHubActionsRun();
    try {
        const response = await axios.post(
            `${PRACTITEST_API_URL}/runs.json`,
            {
                data: {
                    attributes: {
                        'instance-id': instanceId,
                        'exit-code': runStatus,
                        'automated-execution-output': gitHubLink,
                        'custom-fields': { "---f-202603": apiResponse },
                    },
                    files: {
                        data: [
                            { filename: 'Automated report.html', content_encoded: reportContent },
                            //{ filename: 'two.log', content_encoded: twoLogContent },
                        ],
                    },
                    type: 'instances',
                },
            },
            {
                auth: {
                    username: 'saurav.tuladhar@8squarei.com',
                    password: PRACTITEST_API_KEY,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.error(`Error updating test run status:`, error.message);
    }
}

async function requestResponseListeners(page) {
    const data = {
        requests: [],
        responses: [],
        errors: []
    };

    page.on('response', (response) => {
        const responseData = {
            url: response.url(),
            status: response.status(),
            statusText: response.statusText(),
            headers: response.headers(),
        };

        if (response.status() >= 400) {
            console.error('Error Response:', responseData);
            data.errors.push(responseData);
        } else {
            data.responses.push(responseData);
        }
    });

    page.on('request', (request) => {
        const requestData = {
            url: request.url(),
            method: request.method(),
            postData: request.postData(),
            headers: request.headers(),
        };

        console.log('Request:', requestData);
        data.requests.push(requestData);
    });
    return data;
}

async function getEmails() {
    const path = require("path");
    const gmail = require("gmail-tester");
    const email = await gmail.check_inbox(
        path.resolve(__dirname, "../fixtures/credentials.json"),
        path.resolve(__dirname, "../../../token.json"), {
        port: 8000,
        subject: "MMP-BO-password", // We are looking for 'Activate Your Account' in the subject of the message.
        from: "mmpv2uat@vanillatech.ai", // We are looking for a sender header which is 'no-reply@domain.com'.
        to: "automation8squarei@gmail.com", // Which inbox to poll. credentials.json should contain the credentials to it.
        wait_time_sec: 10, // Poll interval (in seconds).
        max_wait_time_sec: 30, // Maximum poll time (in seconds), after which we'll giveup.
        include_body: true,
        limit: 1,
        sort: "date desc"
    }
    );

    if (email && email.length > 0) {
        const latestEmail = email[0];
        console.log("Email body: " + latestEmail.body.html);

        const link = await extractLinkFromHtml(latestEmail.body.html);
        if (link) {
            resetPasswordLink = link;
            console.log('Link:', link);
        } else {
            console.log('Link not found in email.');
        }
    } else {
        console.log("No matching emails found");
    }
    return resetPasswordLink;
}

async function extractLinkFromHtml(html) {
    if (!html) {
        return null;
    }
    const passwordRegex = /Your password for back office login is ([^<]*)/;
    const passwordMatch = html.match(passwordRegex);
    if (passwordMatch) {
        return passwordMatch[1].trim();
    }
    const root = parse(html, { lowerCaseTagName: false });
    const linkAttribute = root.querySelector('a[style="color: red;"]');

    return linkAttribute ? linkAttribute.attributes.href : null;
}

async function authenticateUser(username, password, { request }) {
      //const apiUrl = 'https://mmpv2vuat.digitalmta.com/manage/user/token';
      const apiUrl = await getApiBaseUrl();
      const headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
      };
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      const response = await request.post(apiUrl + "/onboarding/manage/user/token", {
          data: formData.toString(),
          headers,
      });
      const statusCode = response.status();
      expect(statusCode).toBe(200);
      const responseBody = await response.json();
      deleteUserId = responseBody.user.id;
      expect(responseBody).toHaveProperty('access_token');
      accessToken = responseBody.access_token;
      return responseBody.access_token;
}

async function deleteUser(userId, accessToken, { request }) {
    //const apiUrl = `https://mmpv2vuat.digitalmta.com/manage/user/staff-user/${userId}`;
    const apiUrl = await getApiBaseUrl();
    console.log('API Base URL:', apiUrl);
    const headers = {
        'Accept': '*/*',
        'authorization': "Bearer "+accessToken,
    };
    const response = await request.delete(apiUrl + "/onboarding/manage/user/staff-user/" + userId, {
        headers: headers
    });
    const statusCode = response.status();
    console.log('Actual Status Code:', statusCode);
    expect(statusCode).toBe(204);
}

async function createUser(userData, accessToken, { request }) {
    const apiUrl = await getApiBaseUrl();
    console.log('API Base URL:', apiUrl + "/onboarding/manage/manage/user/staff-user");
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'authorization': "Bearer "+accessToken,
    };
    const response = await request.post(apiUrl + "/user/staff-user", {
        headers,
        data: JSON.stringify(userData),
    });

    const statusCode = response.status();
    expect(statusCode).toBe(201);
    const responseBody = await response.json();

}

async function addCampaign(campaignData, accessToken, { request }) {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'access-token': accessToken,
    };
    const response = await request.post("https://mmp2backenddev.vanillatech.asia/notification/manage/marketing/campaign", {
        headers,
        data: JSON.stringify(campaignData),
    });

    const statusCode = response.status();
    expect(statusCode).toBe(201);
    const responseBody = await response.json();
    return responseBody.name;

}

async function getCampaignName() {
    const now = new Date();
    const dateTimeStamp = now.toISOString();
    const title = `Automation-Campaign-${dateTimeStamp}`;
    return title;
}

async function getUpdatedCampaignName() {
    const now = new Date();
    const dateTimeStamp = now.toISOString();
    const title = `Updated Automation-Campaign-${dateTimeStamp}`;
    return title;
}

async function getAllUsers(access, { request }) {
    const apiUrl = await getApiBaseUrl();
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'authorization': "Bearer "+access,
    };

    let allUsers = [];
    let currentPage = 1;
    let totalPages = 1;

    do {
        const response = await request.get(`${apiUrl}/onboarding/manage/user/staff-user?page=${currentPage}`, {
            headers: headers
        });

        const statusCode = response.status();
        console.log('Actual Status Code:', statusCode);
        if (statusCode !== 200) {
            console.error('Failed to get users. Status code:', statusCode);
            return null;
        }
        const responseBody = await response.json();
        allUsers = allUsers.concat(responseBody.results);
        totalPages = responseBody.pagination.pages;

        currentPage++;
    } while (currentPage <= totalPages);

    return allUsers;
}

async function getUserIdByEmail(email, access, context) {
    const allUsers = await getAllUsers(access, context);
    const usersArray = Array.isArray(allUsers) ? allUsers : [];
    const user = usersArray.find(user => user.username.toLowerCase() === email.toLowerCase());
    if (user) {
        return (user.id);
    } else {
        return null;
    }
}

async function forceChangePassword(userId, accessToken, forceChangePassword = false, { request }) {
    //const apiUrl = 'https://mmpv2vuat.digitalmta.com/manage/staff-user-automation/'+userId;
    const apiUrl = await getApiBaseUrl();
    console.log('API Base URL:', apiUrl);
    const headers = {
        'Accept': '*/*',
        'authorization': "Bearer "+accessToken,
        'sig': 'Automation'
    };
    const response = await request.patch(apiUrl + "/onboarding/manage/staff-user-automation/" + userId, {
        headers: headers,
        data: {
            "force_change_password": forceChangePassword
        },
    });
    const statusCode = response.status();
    console.log('Actual Status Code:', statusCode);
    expect(statusCode).toBe(200);
}

async function updatePassword(userId, accessToken, { request }) {
    const apiUrl = await getApiBaseUrl();
    console.log('API Base URL:', apiUrl);
    const headers = {
        'Accept': '*/*',
        'authorization': "Bearer "+accessToken,
        'sig': 'Automation'
    };
    const response = await request.patch(apiUrl + "/onboarding/manage/staff-user-automation/" + userId, {
        headers: headers,
        data: {
            "password": '$2b$12$mBoA0T3dG6H9ql9fo50ZReag9PJGNHSdJHNZNOvyCyDFu6GgxHPTS'
        },
    });
    const statusCode = response.status();
    console.log('Actual Status Code:', statusCode);
    expect(statusCode).toBe(200);
}

async function passwordHistory(userId, accessToken, { request }) {
    const apiUrl = await getApiBaseUrl();
    console.log('API Base URL:', apiUrl);
    const headers = {
        'Accept': '*/*',
        'authorization': "Bearer "+accessToken,
        'sig': 'Automation'
    };
    const response = await request.patch(apiUrl + "/onboarding/manage/staff-user-automation/" + userId, {
        headers: headers,
        data: {
            "password_history": null
        },
    });
    const statusCode = response.status();
    console.log('Actual Status Code:', statusCode);
    expect(statusCode).toBe(200);
}

async function getLatestGitHubActionsRun() {
    // Fetch the latest GitHub Actions run details
    const response = await axios.get(
        `https://api.github.com/repos/${OWNER}/${REPO}/actions/runs`,
        {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
            },
        }
    );
    const latestRun = response.data.workflow_runs[0];
    const githubActionsRunLink = latestRun.html_url;
    return githubActionsRunLink;
}

async function uploadReportToTestSet() {
    try {
        // Read file content in base64 encoding
        const fileContent = fs.readFileSync('playwright-report/index.html', 'base64');

        // Construct the API request
        const response = await axios.post(
            `${PRACTITEST_API_URL}/attachments.json`,
            {
                data: {
                    'entity': 'testset',
                    'entity-id': testSetId,
                    files: {
                        data: [
                            { filename: 'test-report.html', content_encoded: fileContent },
                        ],
                    },
                    type: 'attachments',
                },
            },
            {
                auth: {
                    username: 'saurav.tuladhar@8squarei.com',
                    password: PRACTITEST_API_KEY,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Attachment uploaded successfully:', response.data);
    } catch (error) {
        console.error('Error uploading attachment:', error.message);
    }
}

async function uploadReport() {
    try {
        console.log('Current Working Directory:', process.cwd());
        const absolutePath = path.resolve('playwright-report/index.html');
        const reportContent = fs.readFileSync(absolutePath, 'base64');
        // Construct the API request
        const response = await axios.put(
            `${PRACTITEST_API_URL}/sets/${testSetId}.json`,
            {
                data: {
                    type: 'sets',
                    files: {
                        data: [
                            { filename: 'test-report.html', content_encoded: reportContent },
                        ],
                    },
                    attributes: {
                        'custom-fields': { "---f-202612": reportContent }                        //'Api logs': apiResponse,
                    },
                },
            },
            {
                auth: {
                    username: 'saurav.tuladhar@8squarei.com',
                    password: PRACTITEST_API_KEY,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Attachment uploaded successfully:', response.data);
    } catch (error) {
        console.error('Error uploading attachment:', error.message);
        console.log('Response Data:', error.response?.data);
    }
}

async function getApiBaseUrl() {
    apiUrl = process.env.API_BASE_URL;
    if (!apiUrl) {
        apiUrl = 'https://mmp2backenddev.vanillatech.asia'; //https://mmpv2vuat.digitalmta.com //https://mmp2backenddev.vanillatech.asia
    }
    return apiUrl;
}
async function createEntity(userData, accessToken, module, { request }) {
    const apiUrl = await getApiBaseUrl();
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'authorization': "Bearer "+accessToken,
        'sig': 'Automation',
        //'kbn-xsrf': 'true',
    };
    const response = await request.post(apiUrl + module, {
        headers,
        data: JSON.stringify(userData),
    });

    const responseBody = await response.json();
    const statusCode = response.status();
    expect(statusCode).toBe(201);
    if (responseBody && responseBody.id) {
        return responseBody.id;
    } else {
        return null; // Or you can return any default value if ID is not present
    }
}

async function deleteEntity(accessToken, module, { request }) {
    const apiUrl = await getApiBaseUrl();
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'authorization': "Bearer "+accessToken,
    };
    const response = await request.delete(apiUrl + module, {
        headers,
    });
    console.log("###############"+JSON.stringify(response))
    const statusCode = response.status();
    expect(statusCode).toBe(204);
}

async function validateEntity(accessToken, module, status, { request }) {
    const apiUrl = await getApiBaseUrl();
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'authorization': "Bearer "+accessToken,
    };
    const response = await request.get(apiUrl + module, {
        headers,
    });
    console.log("&&&&&&&&&&&&&&&&&"+JSON.stringify(response))
    const statusCode = response.status();
    expect(statusCode).toBe(parseInt(status));
}

async function updateEntity(userData, accessToken, module, { request }) {
    const apiUrl = await getApiBaseUrl();
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'authorization': "Bearer "+accessToken,
    };
    const response = await request.patch(apiUrl + module, {
        headers,
        data: JSON.stringify(userData),
    });

    const statusCode = response.status();
    expect(statusCode).toBe(200);
    const responseBody = await response.json();
    const id = responseBody.id;
    return id;
}

async function getCurrentDateTimeStamp() {
    const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month since it is zero-based
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

module.exports = { updateRun, requestResponseListeners, getEmails, extractLinkFromHtml, authenticateUser, getCampaignName, getUpdatedCampaignName, deleteUser, createUser, getAllUsers, getUserIdByEmail, forceChangePassword, updatePassword, passwordHistory, uploadReportToTestSet, uploadReport, createEntity, deleteEntity, validateEntity, getCurrentDateTimeStamp};
