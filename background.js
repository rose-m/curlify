function getTab() {
  return browser.tabs.query({active: true, currentWindow: true});
}

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
        return {tabId: tabs[0].id, url: tabs[0].url, cookies};
      });
  });
}

function getCookieForName(cookies, name) {
  const c = cookies.filter(c => c.name === name);
  return c.length ? c[0] : null;
}

browser.browserAction.onClicked.addListener(() => {
  getTabAndCookies()
    .then(({tabId, url, cookies}) => {
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
        .then(() => console.log('yay!'), error => console.error(error));
    });
});
