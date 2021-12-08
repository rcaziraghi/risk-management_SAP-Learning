using RiskService as service from '../../srv/risk-service';

annotate RiskService.Risks with @(UI : {
    HeaderInfo      : {
        TypeName       : 'Risco',
        TypeNamePlural : 'Riscos',
        Title          : {
            $Type : 'UI.DataField',
            Value : title
        },
        Description    : {
            $Type : 'UI.DataField',
            Value : descr
        }
    },

    SelectionFields : [prio],
    Identification  : [{Value : title}],

    // Define as colunas da tabela
    LineItem        : [
        {Value : title},
        {Value : miti_ID},
        {Value : owner},
        {Value : bp_BusinessPartner },
        {
            Value       : prio,
            Criticality : criticality
        },
        {
            Value       : impact,
            Criticality : criticality
        },
    ],
});

//Pagina objeto de Risco
annotate RiskService.Risks with @(UI : {
    Facets           : [{
        $Type  : 'UI.ReferenceFacet',
        Label  : 'Main',
        Target : '@UI.FieldGroup#Main',
    }],
    FieldGroup #Main : {Data : [
        {Value : miti_ID},
        {Value : owner},
        {Value : bp_BusinessPartner},
        {
            Value       : prio,
            Criticality : criticality
        },
        {
            Value       : impact,
            Criticality : criticality
        }
    ]},

});
