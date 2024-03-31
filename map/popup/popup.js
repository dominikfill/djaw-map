import Mustache from 'mustache';

export default async function renderPopupContent(template_url, vars) {
  const response = await fetch(template_url);
  const template = await response.text();
  return Mustache.render(template, {
    name_modern: vars.name_modern,
    name_historical: vars.name_historical,
    wikipedia: vars.wikipedia,
    country_ISO3: vars.country_ISO3,
  });
}
