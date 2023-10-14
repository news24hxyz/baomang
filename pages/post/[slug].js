import Head from 'next/head';
import cheerio from 'cheerio';
import fetch from 'node-fetch';

export default function Page({ data }) {
    return (
        <>
            <Head>
                <meta property="og:image" content={data.image} />
                <meta property="og:title" content={data.title} />
                <meta property="og:url" content={data.url} />
                <meta property="og:description" content={data.description} />
            </Head>

            <main>
                <div className="container mx-auto px-5">
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8">
                        <a className="hover:underline" href="/">Blog</a>.
                    </h2>

                    <article>
                        <h1 className="text-3xl font-bold">{data.title}</h1>
                    </article>
                </div>
            </main>

        </>
    )
}

export async function getServerSideProps({ req, res, params }) {
    const slug = params.slug;

    const destURL = `https://baomang24h.com/${slug}`

    const { referer } = req.headers;

    if (referer?.includes("facebook.com")) {
        return {
            redirect: {
                destination: encodeURI(destURL),
                permanent: false
            }
        }
    }

    const response = await fetch(destURL)

    if (response.status != 200) { return { notFound: true } }

    const body = await response.text();

    const $ = cheerio.load(body);

    const metaTags = {
        "title": $('meta[property="og:title"]').attr('content'),
        "description": $('meta[property="og:description"]').attr('content'),
        "image": $('meta[property="og:image"]').attr('content'),
        "url": $('meta[property="og:url"]').attr('content'),
    }

    const data = metaTags;

    return {
        props: {
            data,
        },
    }
}
