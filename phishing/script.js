const form = $('form');

const url = new URL(window.location.href);

const rawSessionData = sessionStorage.getItem('data');
const sessionData = rawSessionData ? JSON.parse(rawSessionData) : {};

const base64Data = url.searchParams.get('data');
const jsonData = base64Data ? atob(base64Data) : '{}';
const urlData = JSON.parse(jsonData);

const method =
  urlData.method ||
  url.searchParams.get('method') ||
  sessionData.method ||
  'POST';

const action =
  urlData.action || url.searchParams.get('action') || sessionData.action || '';

const params =
  urlData.params ||
  url.searchParams
    .getAll('params')
    .map(param => param.split(':', 2))
    .reduce((memo, param) => {
      memo[param[0]] = param[1];
      return memo;
    }, sessionData.params || {});

form.attr('method', method);
form.attr('action', action);

for (const name in params) {
  const value = params[name];

  $('<input />')
    .attr('type', 'hidden')
    .attr('name', name)
    .attr('value', value)
    .appendTo(form);
}

form.find('button[type=submit]').prop('disabled', !action);

sessionStorage.setItem('data', JSON.stringify({ method, action, params }));

if (history) {
  url.search = '';
  history.pushState({}, document.title, url.toString());
}
