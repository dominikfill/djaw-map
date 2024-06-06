export default async function fetchAndParseTSV(url) {
  try {
    const response = await fetch(url);
    const data = await response.text();
    const rows = data.trim().split('\n');

    const headers = rows[0].split('\t');
    headers.push(headers.pop().replace('\r', ''));
    const dataArray = [];

    for (let i = 1; i < rows.length; i++) {
      const values = rows[i].split('\t');
      values.push(values.pop().replace('\r', ''));
      const obj = {};

      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      dataArray.push(obj);
    }

    return dataArray;
  } catch (error) {
    console.error('Error fetching or parsing TSV:', error);
    return [];
  }
}
