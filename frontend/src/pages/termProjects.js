import styles from './styles/Projects.module.css';

export default function TermProjects({ sheetdata }) {

    // copy link to clipboard
    const copyLink = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert("Link copied to clipboard!"); 
        }, (err) => {
            alert("Failed to copy! Please try again."); 
        });
    };

    // display term projects
    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Term Projects</h1>
            <div className={styles.box}>
                {sheetdata.map((row, index) => (
                    index >= 0 && (
                        <div className={styles.row} key={index}>
                            <div>{row[0]}</div>
                            <div>{row[1]}</div>
                            <div>
                                <a href={row[2]} target="_blank" rel="noopener noreferrer">
                                    {row[2]}
                                </a>
                            </div>
                            <div>
                                <button onClick={() => copyLink(row[2])} className={styles.copyButton}>
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}

// fetch data from the server-side before rendering the page
export async function getServerSideProps() {
    const req = await fetch('http://localhost:3000/api/googleSheet');
    const res = await req.json();

    return {
        props: {
            sheetdata: res.data || []
        }
    }
}