import Document, { Html, Head, Main, NextScript } from 'next/document';
class MyDocument extends Document {
    render() {
        return (
            <Html >
                <Head>
                    {/* Add your HTML tag modifications here */}
                    {/* For example, add a meta tag */}
                    <meta name="description" content="My custom description" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
export default MyDocument;
