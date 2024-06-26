const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { diffLines, formatLines } = require('unidiff');
const { parseDiff, Diff, Hunk } = require('react-diff-view');
const ReactDOMServer = require('react-dom/server');
const React = require('react');

const app = express();
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(bodyParser.json());

const EMPTY_HUNKS = [];

const creatediffcontent = (type, hunks) => {
    const diffContent = React.createElement(
        Diff,
        { viewType: 'split', diffType: type, hunks: hunks },
        hunks => hunks.map(hunk => React.createElement(Hunk, { key: hunk.content, hunk: hunk }))
    );
    return ReactDOMServer.renderToStaticMarkup(diffContent);
};

const defaulthtml = (type, hunks, suggest) => {
    const sugges = suggest;
    console.log("Suggestion is :",sugges);
    const htmlContent = creatediffcontent(type, hunks);
    
    const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Generated Content</title>
            <style>
                body { font-family: Arial, sans-serif; width:100%}
                .diff { display: flex; }
                .hunk { margin: 10px 0; }
                .insert { background-color: lightgreen; width:50%}
                .delete { background-color: lightcoral; width:50%}
            </style>
            <link rel="stylesheet" href="https://unpkg.com/react-diff-view/style/index.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/4.16.13/antd.min.css">
        </head>
        <body>
            ${htmlContent}
            ${sugges}
        </body>
        </html>
    `;
    return fullHtml;
};

const serializeContentToHTML = (type, hunks, suggest) => {
    return defaulthtml(type, hunks, suggest);
};

app.post('/api/codes', async (req, res) => {
    try {
        const { snippet1, snippet2, Suggestion } = req.body;

        if (!snippet1 || !snippet2) {
            return res.status(400).json({ error: 'Both snippet1 and snippet2 are required' });
        }

        const oldCode = snippet1;
        const newCode = snippet2;
        const suggest = Suggestion;
        if (typeof oldCode !== 'string' || typeof newCode !== 'string') {
            console.error('Old code or new code is not a string:', { oldCode, newCode });
            return res.status(400).json({ error: 'Invalid code format' });
        }

        const diffText = formatLines(diffLines(oldCode, newCode), { context: 3 });
        const [diff] = parseDiff(diffText, { nearbySequences: 'zip' });
        const hunks = diff.hunks || EMPTY_HUNKS;

        const fullHtml = serializeContentToHTML('split', hunks, suggest);
        const filename = 'generated_content.html';
        const filePath = path.join(__dirname, filename);

        fs.writeFile(filePath, fullHtml, 'utf8', (err) => {
            if (err) {
                console.error('Error writing HTML file:', err);
                return res.status(500).send('Error saving HTML file');
            }
            console.log('HTML file saved successfully at:', filePath);
            res.send('HTML file saved successfully');
        });

    } catch (error) {
        console.error('Error generating and saving HTML:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
