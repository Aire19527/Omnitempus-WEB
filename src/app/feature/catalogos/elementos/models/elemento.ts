export interface Element {
    id: number;
    name: string;
    classificationId: number;
    classificationName: string;
    typeElement: string;
    distributionType: number;
    description: string;
    code: string;
    isRelationShip: string;
    elementRelationId: string[];
}


export interface ElementoType {
    id: string;
    name: string;
}