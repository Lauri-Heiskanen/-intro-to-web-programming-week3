if (document.readyState !== "loading") {
  initializeCode();
} else {
  document.addEventListener("DOMContentLoaded", function () {
    initializeCode();
  });
}

async function initializeCode() {
  const populationDataPromise = await fetch(
    "https://statfin.stat.fi/PxWeb/sq/4e244893-7761-4c4f-8e55-7a8d41d86eff "
  );
  let populationData = await populationDataPromise.json();

  const emplymentDataPromise = await fetch(
    "https://statfin.stat.fi/PxWeb/sq/5e288b40-f8c8-4f1e-b3b0-61b86ce5c065 "
  );
  let employmentData = await emplymentDataPromise.json();
  console.log(employmentData);
  reloadTable(populationData, employmentData);
}

function reloadTable(populationData, employmentData) {
  for (const key in populationData.dataset.dimension.Alue.category.index) {
    const municipality =
      populationData.dataset.dimension.Alue.category.label[key];
    const population =
      populationData.dataset.value[
        populationData.dataset.dimension.Alue.category.index[key]
      ];
    const employment =
      employmentData.dataset.value[
        populationData.dataset.dimension.Alue.category.index[key]
      ];
    const employmentPercent =
      Math.round((employment / population) * 10000) / 100; // didn't find a simple way to specify rounding to 2 decimal places
    addTableRow(municipality, population, employment, employmentPercent);
  }
}

function addTableRow(municipality, population, employment, employmentPercent) {
  const newTableRow = document.createElement("tr");

  const municipalityElement = document.createElement("td");
  municipalityElement.innerText = municipality;
  newTableRow.appendChild(municipalityElement);

  const populationElement = document.createElement("td");
  populationElement.innerText = population;
  newTableRow.appendChild(populationElement);

  const employmentElement = document.createElement("td");
  employmentElement.innerText = employment;
  newTableRow.appendChild(employmentElement);

  const employmentPercentElement = document.createElement("td");
  employmentPercentElement.innerText = employmentPercent + "%";
  newTableRow.appendChild(employmentPercentElement);

  newTableRow.setAttribute("employmentPercent-category", 0);
  if (employmentPercent > 45) {
    newTableRow.setAttribute("employmentPercent-category", 2);
  }
  if (employmentPercent < 25) {
    newTableRow.setAttribute("employmentPercent-category", 1);
  }

  const tableBody = document.getElementById("table-body");
  tableBody.appendChild(newTableRow);
}
