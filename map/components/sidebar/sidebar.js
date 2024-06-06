import Mustache from 'mustache';

export default function renderSidebarContent(template, vars) {
  return Mustache.render(template, {
    name_modern: vars.name_modern,
    name_historical: vars.name_historical,
    wikipedia: vars.wikipedia,
    country_ISO3: vars.country_ISO3,
    src: vars.src,
    src_quote: vars.src_quote,
    src_link: vars.src_link,
  });
}
