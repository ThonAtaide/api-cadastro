
export interface ISettings {
    DATABASE_URL: string,
    PORT: string,
    SECRET_KEY: string,
}

export default (): ISettings => {
    if (process.env.NODE_ENV === 'production') {
        console.log(`Running in Production`);
        const database_host: string = process.env.DATABASE_HOST as string;
        let database_url: string = process.env.DATABASE_URL as string;
        console.log(`Database connected url: ${database_url.replace('?', database_host)}`)
        return {
            DATABASE_URL: database_url.replace('?', database_host) as string,
            PORT: process.env.PORT as string,
            SECRET_KEY: process.env.SECRET_KEY as string
        }
    }
    console.log('Running on development mode.');
    const database_host: string = process.env.DATABASE_HOST as string;
    let database_url: string = process.env.DATABASE_URL as string || `postgres://postgres:root@localhost:5432/APICADASTRO`;
    return {
        DATABASE_URL: database_host? database_url.replace('?', 'database_host'): database_url,
        PORT: process.env.PORT as string || '5000',
        SECRET_KEY: process.env.SECRET_KEY as string || 'dsjhdsgdsdsgjshjhskjdgshjdsfsagghsfhs'
    }
}