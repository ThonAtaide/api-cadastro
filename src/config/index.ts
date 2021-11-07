
export interface ISettings {
    DATABASE_URL: string,
    PORT: string
}

export default (): ISettings => {
    if (process.env.NODE_ENV === 'production') {
        return {
            DATABASE_URL: process.env.DATABASE_URL as string,
            PORT: process.env.PORT as string
        }
    }
    return {
        DATABASE_URL: 'postgres://postgres:root@localhost:5432/APICADASTRO',
        PORT: '5000'
    }
}