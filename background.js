/**
 * Get the currently active tab
 */
function getTab() {
  return browser.tabs.query({ active: true, currentWindow: true });
}

/**
 * Get the currently active tab details and the matching cookies
 * 
 * @returns {{tabId:number; url:string; cookies: cookies.Cookie[]}}
 */
function getTabAndCookies() {
  return getTab().then(tabs => {
    if (!tabs[0]) {
      return;
    }

    return browser.cookies
      .getAll({
        url: tabs[0].url
      })
      .then(cookies => {
        return { tabId: tabs[0].id, url: tabs[0].url, cookies };
      });
  });
}

/**
 * Get a cookie for a specified name if available
 * 
 * @param {cookies.Cookie[]} cookies Array of cookies to search in
 * @param {string} name Name of the cookie
 * @returns {cookies.Cookie} The cookie if found or null
 */
function getCookieForName(cookies, name) {
  const c = cookies.filter(c => c.name === name);
  return c.length ? c[0] : null;
}

// Register the browser action click listener
browser.browserAction.onClicked.addListener(() => {
  getTabAndCookies()
    .then(({ tabId, url, cookies }) => {
      let command = 'curl ';
      const c = getCookieForName(cookies, 'PERMANENT_COOKIE') || getCookieForName(cookies, 'JSESSIONID');
      if (c) {
        command += `--cookie \\"${c.name}=${c.value}\\" `;
      }
      command += url;
      
      browser.tabs
        .executeScript(tabId, {
          code: `
            (function() {
              let input = document.createElement('input');
              input.setAttribute('type', 'text');
              input.value = "${command}";
              document.body.appendChild(input);
              input.select();
              !document.execCommand('copy');
              input.remove();
            })();
          `
        })
        .then(() => console.log('copied command', command), error => console.error(error));
    });
});
