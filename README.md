# Genetic Drift Lab — v1.2

A standalone, GitHub Pages-ready population-genetics teaching application. No installation or server required.

## Publish

Upload **all files in this directory** (not the ZIP itself) to the root of a GitHub repository, then go to **Settings → Pages → Deploy from branch → main → /(root)**.

## Teaching interface

The panels are ordered as: **Three ways chance changes populations → How do alleles interact? → Simulation settings → Populations → Graph → Student practical**.

### Ten-run student practical

1. Set founders for Island 1 to **5**.
2. Select **Setup / reset**. Optionally step through a fixed number of generations before colonisation.
3. Select **Colonise Island 1** and, **before advancing again**, select **Record result**.
4. Repeat from Setup / reset until ten rows are saved.
5. Download the student CSV containing *only* mainland and island frequencies for Y, B, R (plus run and student ID). Students compute allele loss and differences in their own worksheet.

Use **Undo last result** if a mistake is made. Repeated recording of the same colonisation would not constitute independent runs; reset between runs. The app checks that frequencies are taken immediately after colonisation with five founders, but does not independently verify a reset between records.

A collapsible lecturer demonstration generates 42 independent founder events and exports only raw values. It does not collect student data automatically.

## Model assumptions

Neutral diploid inheritance, random mating, random reproductive sampling, no selection or migration or mutation. Mainland and island carrying capacities are set by the user. Island 2 derives from Island 1. Founding copies random individuals from the source population without removing them. This is an independent teaching model, not the original source code.

## Technical

`index.html`, `style.css`, and `app.js` must be in the same directory. Everything runs locally inside the browser. Data are not uploaded to any server.


### Version 1.3 — visible student results
After each successful **Record result**, the six raw allele frequencies appear in the on-page table. The same values are exported to the CSV. The on-page table now retains results across normal page refreshes in the same browser (browser local storage); this is not an online central collection system. Use **Clear recorded results** before starting a new student's session on a shared computer.
