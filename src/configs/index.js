import { getQueryString } from '@utils';

const thirdServer = {
    'tianan': {
        dev: 'https://api-uat.tianan-life.com',
        prod: 'https://crmapi.tianan-life.com'
    },
    'ls': {
        dev: 'https://sports.lifesense.com',
        prod: 'https://sports.lifesense.com'
    }
}

const getThirdInfo = (tenant) => {
    let server = thirdServer['ls'].prod

    if (tenant) {
        let tenantArr = tenant.split('-')
        tenant = tenantArr[0];
        let serverEnv = tenantArr[1]
        server = tenantArr.length > 1 ? thirdServer[tenant][serverEnv] : thirdServer[tenant].prod
    }

    switch (tenant) {
        case 'tianan':
            return {
                server,
                appId: "2a6bf452219cfe44c7f78231e3c80a13072b6727",
                appSecret: "5d1f576d88d5d72ef48e0a2fed3cda48cee15711",
                appType: 1
            }
        case 'ls':
            return {
                server,
                appId: "2a6bf452219cfe44c7f78231e3c80a13072b6727",
                appSecret: "5d1f576d88d5d72ef48e0a2fed3cda48cee15711",
                appType: 1
            }
        default:
            return {
                server,
                appId: "2a6bf452219cfe44c7f78231e3c80a13072b6727",
                appSecret: "5d1f576d88d5d72ef48e0a2fed3cda48cee15711",
                appType: 1
            }
    }
}

const server = (isThirdServer, tenant) => {
    let mHost = window.location.hostname
    try {
        if (getQueryString('env', '?' + window.location.hash.split('?')[1]) == 'pro') {
            mHost = 'cdn.lifesense.com'
        }
    } catch (e) {

    }
    if (!isThirdServer) {
        return {
            '172.16.10.81': '/',
            'localhost': '/',
            "static-qa.lifesense.com": 'https://sports-beta.lifesense.com',
            "cdn.lifesense.com": "https://sports.lifesense.com"
        }[mHost] || 'https://sports.lifesense.com'
    }
    return {
        'localhost': '/',
        "static-qa.lifesense.com": 'https://sports-beta.lifesense.com',
        "cdn.lifesense.com": getThirdInfo(tenant).server,
    }[mHost] || getThirdInfo(tenant).server
}

export {
    server,
    getThirdInfo
}