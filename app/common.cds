using riskmanagement as rm from '../db/schema';

// Anotacoes do elemento Risk
annotate rm.Risks with {
    ID     @title : 'Risco';
    title  @title : 'Título';
    owner  @title : 'Dono';
    prio   @title : 'Prioridade';
    descr  @title : 'Descrição';
    miti   @title : 'Mitigação';
    impact @title : 'Impacto';
}

//Anotacoes do element Miti
annotate rm.Mitigations with {
    ID    @(
        UI.Hidden,
        Commong : {Text : descr}
    );
    owner @title : 'Dono';
    descr @title : 'Descrição';
}

annotate rm.Risks with {
    miti @(Common : {
        //Mostra texto e não ID para mitigacao no contexto de riscos
        Text            : miti.descr,
        TextArrangement : #TextOnly,
        ValueList       : {
            Label          : 'Mitigações',
            CollectionPath : 'Mitigações',
            Parameters     : [
                {
                    $Type             : 'Common.ValueListParameterInOut',
                    LocalDataProperty : miti_ID,
                    ValueListProperty : 'ID'
                },
                {
                    $Type             : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty : 'descr'
                }
            ]
        },
    })
}
