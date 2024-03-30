export default function createPopupHTML(name1, name2) {
  // Create a document fragment
  var fragment = document.createDocumentFragment();

  var styles = document.createElement('style');
  // Add styles dynamically
  styles.textContent = `
    body {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    p.placename {
        font-family: verdana;
        font-size: 20px;
        margin: 0;
    }

    p.placename-is-historical {
        font-family: verdana;
        font-size: 15px;
        font-style: italic;
        margin: 0;
        margin-left: 0.5em;
    }

    aside {
        display: flex;
        align-items: baseline;
    }
`;

  document.head.appendChild(styles);

  // Create elements
  var body = document.createElement('body');
  var placenameParagraph1 = document.createElement('p');
  var placenameParagraph2 = document.createElement('p');
  var historicalParagraph = document.createElement('p');
  var aside = document.createElement('aside');

  // Set class names
  placenameParagraph1.className = 'placename';
  placenameParagraph2.className = 'placename';
  historicalParagraph.className = 'placename-is-historical';

  // Set text content
  var boldName1 = document.createElement('b');
  boldName1.textContent = name1;
  placenameParagraph1.appendChild(boldName1);

  var boldName2 = document.createElement('b');
  boldName2.textContent = name2;
  placenameParagraph2.appendChild(boldName2);

  historicalParagraph.textContent = 'hist.';

  // Append elements to the fragment
  body.appendChild(placenameParagraph1);
  aside.appendChild(placenameParagraph2);
  aside.appendChild(historicalParagraph);
  body.appendChild(aside);
  fragment.appendChild(body);

  // Return the created aside element
  return fragment;
}
