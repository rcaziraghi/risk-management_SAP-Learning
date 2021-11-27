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

    //Conectar ao servico remoto
    const BPsrv = await cds.connect.to("API_BUSINESS_PARTNER");

    // cada chamada ao API Business Hub precisa da chave API
    this.on("READ", BusinessPartners, async (req) => {
        // A API retorna varios BP com nomes em branco, vamos retira-los
        req.query.where("LastName <> '' and FirstName <> '' ");

        return await BPsrv.transaction(req).send({
            query: req.query,
            headers: {
                apikey: process.env.apikey,
            }
        })
    })

    /**  * Event-handler para risks.  
     * * busca o BusinessPartner do API externo  */
    this.on("READ", Risks, async (req, next) => {
        /*  Verifica se a request quer fazer o "expand" para BP pois isto nao eh possivel.
            As duas informacoes (riscos e BP) estao em sistemas diferentes (BP e S/4 HANA Cloud)
            Se houver expand, remove */

        const expandIndex = req.query.SELECT.columns.findIndex(
            ({ expand, ref }) => expand && ref[0] === "bp"
            );

        console.log(req.query.SELECT.columns);

        if (expandIndex < 0) return next();

        req.query.SELECT.columns.splice(expandIndex, 1);

        if (!req.query.SELECT.columns.find((column) => column.ref.find((ref) => ref == "bp_BusinessPartner"))) {
            req.query.SELECT.columns.push({ ref: ["bp_BusinessPartner"] });
        }
        /*  ao inves de fazer o expand, faz uma request a parte para cada BP
            este codigo pode ser melhorado, com uma busca somente para todos os BPs ao inves de buscas individuais */

        try {
            const res = await next();
            await Promise.all(
                res.map(async (risk) => {
                console.log("risk", risk);
                const bp = await BPsrv.transaction(req).send({
                    query: SELECT.one(this.entities.BusinessPartners)
                        .where({ BusinessPartner: risk.bp_BusinessPartner })
                        .columns(["BusinessPartner", "LastName", "FirstName"]),
                    headers: { apikey: process.env.apikey, },
                }); 
                risk.bp = bp;
            }));
        } catch (error) { }
    });
});