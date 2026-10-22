# Genetic Drift Lab — v1.2

A standalone, GitHub Pages-ready population-genetics teaching application. No installation or server required.

## Publish

Upload **all files in this directory** (not the ZIP itself) to the root of a GitHub repository, then go to **Settings → Pages → Deploy from branch → main → /(root)**.

## Teaching interface

The panels are ordered as: **Three ways chance changes populations → How do alleles interact? → Simulation settings → Populations → Graph → Student practical**.

### Ten-run student practical (v1.5)

1. Set Island 1 founders to **5** and keep population capacities consistent.
2. Select **Setup / reset**, optionally warm up the mainland as instructed, then **Colonise Island 1**.
3. Click **Advance to generation +100** (100 generations after colonisation, not global generation 100).
4. Click **Record result**. It stores current FINAL mainland and island allele frequencies, not founding values. Manual stepping is also allowed but recording requires exactly 100 generations after colonisation.
5. Reset and repeat for **ten independent runs**. Export CSV; the table and CSV contain final generation count and six raw allele frequencies, but no student calculations.

Results are saved in the student's browser local storage and not collected centrally. Clear results to start another class/session.

The optional 42-event lecturer demonstration now also evolves each island/mainland pair for 100 generations before recording final frequencies.

## Model assumptions

Neutral diploid inheritance, random mating, random reproductive sampling, no selection or migration or mutation. Mainland and island carrying capacities are set by the user. Island 2 derives from Island 1. Founding copies random individuals from the source population without removing them. This is an independent teaching model, not the original source code.

## Technical

`index.html`, `style.css`, and `app.js` must be in the same directory. Everything runs locally inside the browser. Data are not uploaded to any server.


### Version 1.3 — visible student results
After each successful **Record result**, the six raw allele frequencies appear in the on-page table. The same values are exported to the CSV. The on-page table now retains results across normal page refreshes in the same browser (browser local storage); this is not an online central collection system. Use **Clear recorded results** before starting a new student's session on a shared computer.


## v1.4 recording fix
The five-founder allele-frequency snapshot is captured immediately on Colonise Island 1 and subsequently recorded by Record result, even when the island population grows. Results are stored locally in the browser and exported as raw CSV; no allele-loss calculations are given.


## v1.6 recording improvement

After reset and colonisation with five founders, click **Record final result**. The application automatically advances to 100 generations after colonisation, records current final mainland and Island 1 frequencies, and displays them in the on-page results table. The 10-run results can be exported to CSV. The button also works after manually advancing fewer than 100 generations. Students calculate allele loss and frequency differences themselves.


## Version 1.7 — simplified student recording

The ten-run practical is independent of the free-play controls. Each press of **Record next run** starts a fresh random mainland, draws exactly five founders for Island 1, evolves both populations for 100 generations, and immediately appends the six final allele frequencies to the displayed table. Ten clicks yield ten runs and a downloadable CSV. Students calculate differences and allele loss themselves. The 42-run demonstration and interactive main simulation remain available.


## v1.8 classroom illustrations
Added three self-contained SVG diagrams (genetic drift, population bottleneck and founder effect) above the respective explanations. All five v1.7 application files remain otherwise unchanged except for image references and illustration CSS. The `app.js` file is **identical** to working v1.7. Upload the eight files in this ZIP to the GitHub Pages repository root. The diagrams are schematic: coloured dots represent allele copies, not necessarily individual diploid organisms.

## Diagram note (v1.9)
The population bottleneck illustration uses **five illustrative colour variants before** the bottleneck and two after, to make genetic diversity loss more visually apparent. It is a conceptual diagram; the interactive simulation itself continues to model three alleles (Y, B, R), and its code is unchanged.
