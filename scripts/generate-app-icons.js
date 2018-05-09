#!/usr/bin/env node
const icongen = require('icon-gen');
const fs = require('fs');
const path = require('path');
const svg2png = require('svg2png');

const jobList = [
  {
    name: 'Electron Main App Icon',
    runner: 'icongen',
    inputFile: 'assets/icons/Arc-Desktop.svg',
    outputPath: 'build-resources',
    options: {
      modes: ['ico', 'icns'], // all
      names: {
        ico: 'icon',
        icns: 'icon',
      },
      report: true,
    },
  },
];

const icongenTask = (specification) => {
  icongen(specification.inputFile, specification.outputPath, specification.options)
    .catch((err) => {
      throw err;
    });
};

const svg2pngTask = (specification) => {
  const buffer = fs.readFileSync(specification.inputFile);

  if (!buffer) {
    throw Error(`Failed to write the image ${specification.size} x ${specification.size}`);
  }

  specification.sizes.forEach((size) => {
    let dest = `${specification.fileName}${specification.append[specification.sizes.indexOf(size)]}.png`;
    dest = path.join(specification.outputPath + dest);

    svg2png(buffer, { width: size, height: size }).then((output) => {
      fs.writeFile(dest, output, (err) => {
        if (err) throw err;
      });
    });
  });
};

const parseJobs = (jobs) => {
  jobs.forEach((job) => {
    if (job.runner === 'icongen') {
      icongenTask(job);
    } else {
      svg2pngTask(job);
    }
  });
};

parseJobs(jobList);
