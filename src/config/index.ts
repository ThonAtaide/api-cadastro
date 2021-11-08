
export interface ISettings {
    DATABASE_URL: string,
    PORT: string,
    SECRET_KEY: string,
}

export default (): ISettings => {
    if (process.env.NODE_ENV === 'production') {
        return {
            DATABASE_URL: process.env.DATABASE_URL as string,
            PORT: process.env.PORT as string,
            SECRET_KEY: process.env.SECRET_KEY as string
        }
    }
    return {
        DATABASE_URL: process.env.DATABASE_URL as string || 'postgres://postgres:root@localhost:5432/APICADASTRO',
        PORT: process.env.PORT as string || '5000',
        SECRET_KEY: process.env.SECRET_KEY as string || 'dsjhdsgdsdsgjshjhskjdgshjdsfsagghsfhs'
    }
}