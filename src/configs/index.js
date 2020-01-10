const server = () => {
    let mHost = window.location.hostname
    return {
        '172.16.10.123': '/',
        'localhost': '/',
        "static-qa.lifesense.com": 'https://sports-beta.lifesense.com',
        "cdn.lifesense.com": 'https://sports.lifesense.com',
    }[mHost] || 'https://sports.lifesense.com'
}

export {
    server
}