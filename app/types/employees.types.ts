export interface ApiEmployeesData{
    _id?: string,
    legajo: string,
    apellido: string,
    nombre: string,
    cuil: string,
    contratacion: string,
    fecha_ingreso:Date;
    gerencia: string,
    area: string,
    sector: string,
    centro_de_costo:string,
    convenio: string,
    categoria: string,
    dni: string,
    fecha_nacimiento:Date,
    sexo: string,
    email: string,
    telefono: string,
    telefono_urgencia:string,
    pais:string,
    provincia:string,
    ciudad:string,
    calle:string,
    numero:string
    departamento:string,
    piso:string;
    codigo_postal:string,
    nivel_educacion:string,
    activo: boolean,
    fecha_egreso:Date;
    estado_ambiental:string;
    examen_preocupacional:string;
    tipo_liquidacion:string;
    rotacion:string,
    turno:string,
    grupo:string,
    jornada?: Jornadas[],
    liquidacion?: Liquidacion[],
    observaciones: string,
    foto?: string,
}
interface Jornadas{
   fecha: Date;
   suspension:Boolean;
   licencia:string;
   feriado:Boolean;
   entrada:Date|null;
   salida:Date|null;
   entrada_descanso:Date|null;
   salida_descanso:Date|null;
   habilitado_horas_extra:Boolean;
   entrada_horas_extra:Date|null;
   salida_horas_extra:Date|null;
   descanso:Boolean;
   horas_diurnas:number;
   horas_nocturnas:number;
   horas_diurnas_50:number;
   horas_nocturnas_50:number;
   horas_diurnas_100:number;
   horas_nocturnas_100:number;
   observaciones:string;
}
interface Liquidacion{
    fecha_liquidacion_horas:Date;
    total_horas_diurnas:Number;
    total_horas_nocturnas:Number;
    total_horas_diurnas_50:Number;
    total_horas_nocturnas_50:Number;
    total_horas_diurnas_100:Number;
    total_horas_nocturnas_100:Number;
    total_diurna_enfermedad:Number;
    total_nocturna_enfermedad:Number;
    total_licencia_gremial:Number;
    total_diurna_feriado_ley:Number;
    total_nocturna_feriado_ley:Number;
    total_accidente:Number;
    total_vacaciones:Number;
    total_licencia_maternidad:Number;
    total_licencia_mudanza:Number;
    total_licencia_nacimiento:Number;
    total_ausente_con_aviso:Number;
    total_ausente_sin_aviso:Number;
    total_licencia_examen:Number;
    total_suspension:Number;
    total_licencia_fallecimiento:Number;
    total_licencia_matrimonio:Number;
    total_licencia_donacion_sangre:Number;
    total_ausencia_enfermadad_injustificada:Number;
    total_diurna_reserva_legal_puesto:Number;
    total_nocturna_reserva_legal_puesto:Number;
    total_licencia_aislamiento:Number;
    total_licencia_vacunacion:Number;
}