namespace riskmanagement;

using {managed} from '@sap/cds/common';

entity Risks : managed {
    key ID          : UUID @(Core.Computed : true);
        title       : String(100);
        owner       : String;
        prio        : String(5);
        descr       : String;
        miti        : Association to Mitigations;
        impact      : Integer;
        //bp : Association to BusinessPartners;
        // Vai ser necessario em outro passo adiante
        criticality : Integer
}

entity Mitigations : managed {
    key ID       : UUID @(Core.Computed : true);
        descr    : String;
        owner    : String;
        timeline : String;
        risks    : Association to many Risks
                       on risks.miti = $self;
}
