const fs = require('fs');
const path = require('path');

const jobs = JSON.parse(fs.readFileSync('jobs.json', 'utf8'));
const technologies = JSON.parse(fs.readFileSync('technologies.json', 'utf8'));
let timestamp;

function tagJobsWithTechnologies(jobs, technologies) {
    timestamp = Date.now(); 

    const taggedJobs = jobs.map(job => {
        const mentionedTechnologies = [];
            technologies.forEach((tech) => {
                const escapedTech = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`\\b${escapedTech.toLowerCase()}\\b`, 'i');
                if (regex.test(job.description.toLowerCase())) {
                    mentionedTechnologies.push(tech);
                }
            });

        return {
            ...job,
            tags: mentionedTechnologies,
            timestamp: timestamp
        };
    });
    return taggedJobs;
}

const taggedJobs = tagJobsWithTechnologies(jobs, technologies);
    
    const filename = `${timestamp}_response.json`;
    const filedata = JSON.stringify(taggedJobs, null, 2);
    fs.writeFile(filename, filedata, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log(`File "${filename}" has been saved.`);
        console.log(JSON.parse(filedata));
    });

