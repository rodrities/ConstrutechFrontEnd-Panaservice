export interface LoginResponse {
    error:   string;
    codigo:  number;
    mensaje: string;
    data:    Data;
}

export interface Data {
    accessToken: string;
    usuarioId:   number;
    persona:     Persona;
}

export interface Persona {
    perId:              number;
    perNuDoc:           string;
    perNombres:         string;
    perApePaterno:      string;
    perApeMaterno:      string;
    perNomCompleto:     string;
    perNuTelefono:      string;
    perCorreo:          string;
    perDireccion:       string;
    perFeCrea:          Date;
    perUsuCreaId:       number;
    perFeMod:           null;
    perUsuModId:        null;
    perEstId:           number;
    perSexo:            string;
    perFeNacimiento:    Date;
    perUbigeo:          string;
    perFeIngreso:       Date;
    perFeCese:          null;
    perDiscapacitado:   string;
    perDepartamento:    string;
    perProvincia:       string;
    perDistrito:        string;
    tipoDocumento:      TipoDocumento;
    centroCosto:        CentroCosto;
    estadoCivil:        EstadoCivil;
    tipoProfesion:      TipoProfesion;
    sede:               Sede;
    cargo:              Cargo;
    cargoTipo:          CargoTipo;
    tipoPersonal:       TipoPersonal;
    tipoTrabajador:     TipoTrabajador;
    horario:            Horario;
    tipoNivelEducativo: TipoNivelEducativo;
    categoria:          Categoria;
}

export interface Cargo {
    cargId:          number;
    cargDescripcion: string;
    cargFeCrea:      Date;
    cargUsuCreaId:   number;
    tipoCargo:       TipoCargo;
}

export interface TipoCargo {
    tcarId:          number;
    tcarDescripcion: string;
    tcarFeCrea:      Date;
    tcarUsuCreaId:   number;
}

export interface CargoTipo {
    cartId:          number;
    cartNombre:      string;
    cartCodigoSunat: number;
    cartFeCrea:      Date;
    cartUsuCreaId:   number;
}

export interface Categoria {
    cateId:          number;
    cateNombre:      string;
    cateCodigoSunat: number;
}

export interface CentroCosto {
    ccosId:        number;
    ccosCodigo:    string;
    ccosNombre:    string;
    ccosFeCrea:    Date;
    ccosUsuCreaId: number;
    ccosEstId:     number;
    cccosParent:   CentroCosto | null;
}

export interface EstadoCivil {
    estcId:          number;
    estcNombre:      string;
    estcCodigoSunat: number;
    estcFeCrea:      Date;
    estcUsuCreaId:   number;
}

export interface Horario {
    horaId:            number;
    horaNombre:        string;
    horaObservaciones: string;
    horaFeCrea:        Date;
    horaUsuCreaId:     number;
}

export interface Sede {
    sedeId:        number;
    sedeNombre:    string;
    sedeFeCrea:    Date;
    sedeUsuCreaId: number;
    tipoSede:      TipoSede;
    condicionSede: CondicionSede;
}

export interface CondicionSede {
    consId:          number;
    consNombre:      string;
    consCodigoSunat: number;
    consFeCrea:      Date;
    consUsuCreaId:   number;
}

export interface TipoSede {
    tipsId:          number;
    tipsNombre:      string;
    tipsCodigoSunat: number;
    tipsFeCrea:      Date;
    tipsUsuCreaId:   number;
}

export interface TipoDocumento {
    tdocId:          number;
    tdocDescripcion: string;
}

export interface TipoNivelEducativo {
    tnieId:          number;
    tnieNombre:      string;
    tnieCodigoSunat: number;
    tnieFeCrea:      Date;
    tnieUsuCreaId:   number;
}

export interface TipoPersonal {
    tperId:        number;
    tperNombre:    string;
    tperFeCrea:    Date;
    tperUsuCreaId: number;
}

export interface TipoProfesion {
    tproId:        number;
    tproNombre:    string;
    tproFeCrea:    Date;
    tproUsuCreaId: number;
}

export interface TipoTrabajador {
    tiptId:        number;
    tiptNombre:    string;
    tiptCodPda:    string;
    tiptCodSunat:  string;
    tiptFeCrea:    Date;
    tiptUsuCreaId: number;
}
