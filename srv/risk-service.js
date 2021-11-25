//Imports
const cds = require("@sap/cds");

//Implementacao do servico com todos os handlers

module.exports = cds.service.impl(async function () {
    //Define constantes para as entidades de risco e businesspartners do arquivo risk-service.cds
    const { Risks, BusinessPartners } = this.entities;

    //Define a criticalidade depois de um READ em /risks

    this.after("READ", Risks, (data) => {
        const risks = Array.isArray(data) ? data : [data];

        risks.forEach((risk) => {
            if (risk.impact >= 100000) {
                risk.criticality = 1;
            } else {
                risk.criticality = 2;
            }
        })
    });
});