# Genetic Drift Lab — classroom browser simulation

A **static, client-side** educational simulation of random allele-frequency changes. Includes a mainland and two islands, neutral Mendelian inheritance for a single locus with three alleles, founder effects, bottlenecks, live allele-frequency graphs, and repeatable founder-effect experiments with CSV downloads.

## Publish using GitHub Pages (no terminal required)

1. Create a **public** repository at https://github.com/new (for example, `genetic-drift-lab`).
2. Upload **`index.html`, `style.css`, and `app.js` into the repository root** using **Add file → Upload files**, then commit the changes.
3. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**; select `main` and `/ (root)`; click **Save**.
4. The resulting student URL will normally have the form `https://YOUR-USERNAME.github.io/genetic-drift-lab/`. GitHub Pages publication may take a few minutes.
5. Share the address with your 42 students. Each student's browser runs its own simulation, so the software itself doesn't need a server for computation.

Alternatively, download the three files together and open `index.html` locally. Internet is not necessary after the files are saved.

## Practical for 42 students

- Ask each student to enter an identifier in **Student ID**, set **Founders → Island 1 = 5**, select **10 repetitions**, and click **Run independent founder trials**.
- Export each student's experiment as a CSV file. CSV files include the student identifier as both filename and column.
- Collect the files with your institution's normal learning-management system; **the website does not automatically send or aggregate students' data**.
- Use **42 repetitions** for a quick lecturer demonstration of variability among 42 independent founder events. It is *not* a live linked experiment collecting 42 browser sessions.
- Optional: enter the same reproducibility seed to repeat identical results for troubleshooting. Students should use different seeds or leave the field blank for independent trials.

## Allele interactions guide

The page now includes a prominent **How do the alleles interact?** section before the population displays. It illustrates all six genotype–phenotype combinations, random transmission of parental alleles, why a heterozygote contributes to two allele counts, and why neutral drift is not natural selection. To update an existing GitHub Pages repository, replace `index.html` and `style.css` and commit; `app.js` remains unchanged.

## Scientific implementation

- Each individual is diploid with two alleles selected from Y, B, R. Incomplete dominance maps YB to green, YR to orange, and BR to purple.
- The mainland starts with `Mainland-K` individuals whose two alleles are independently and uniformly sampled from Y, B and R.
- At each discrete generation, the number of individuals becomes the current carrying capacity; each offspring's two alleles come from a randomly chosen allele of each of two randomly chosen parents (sampling with replacement). All genotypes have equal reproductive chances.
- A founder event samples whole diploid individuals **without replacement** from its source and **copies** them to the new island, leaving the source population unchanged. Island 2 is sourced from Island 1.
- A bottleneck samples the given number of **surviving mainland individuals without replacement**.
- No selection, mutation, migration, sex structure, spatial effects, age effects, or mating preference is represented. Simulated generations are simplified and discrete; do not equate them with the precise update rules of the original NetLogo model.
- D = (|Y_island - Y_mainland| + |B_island - B_mainland| + |R_island - R_mainland|)/2, computed at colonisation.
- The replicated experiment generates a fresh population for every run, performs the requested number of mainland generations, and **measures the island immediately after founding**. A lost allele is one present in the run's mainland but absent from its island.

## Credits / copyright

Original educational inspiration and model description: Virtual Biology Lab, *Random Genetic Effects Directions* (copyright 2010). See https://virtualbiologylab.org/pdf/RandomGeneticEffectsDirections.pdf .

This repository contains an **independently authored** implementation, not extracted NetLogo source, art or code. You may modify and share the code under the MIT licence included here. It is not an official Virtual Biology Lab release.
