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

// Register the browser action click listener
browser.browserAction.onClicked.addListener(() => {
  getTabAndCookies()
    .then(({ tabId, url, cookies }) => {
      let command = 'curl ';
      const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
      if (cookieString) {
        command += `--cookie \\"${cookieString}\\" `;
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
        .then(() => {
          browser.browserAction.setBadgeText({ tabId, text: '✓' });
          browser.browserAction.setBadgeBackgroundColor({ tabId, color: 'green' });

          setTimeout(() => {
            browser.browserAction.setBadgeText({ tabId, text: '' });
            browser.browserAction.setBadgeBackgroundColor({ tabId, color: '' });
          }, 500);
        })
        .then(() => console.log('copied command', command), error => console.error(error));
    });
});
