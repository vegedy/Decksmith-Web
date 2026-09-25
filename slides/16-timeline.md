---
title: An experiment in three stages
---

# An experiment in three stages

<Timeline label="Illustrative experiment schedule" :events="[{id:'plan',date:'Week 1',label:'Protocol',detail:'Freeze the question'}, {id:'run',date:'Week 2',label:'Experiment',detail:'Collect measurements'}, {id:'review',date:'Week 3',label:'Review',detail:'Inspect uncertainty'}]" />

<ComparisonTable caption="Two reporting strategies" :columns="[{key:'speed',label:'Speed'}, {key:'audit',label:'Auditability'}]" :rows="[{label:'Manual report',values:{speed:'Variable',audit:'Recorded notes'}}, {label:'Reproducible report',values:{speed:'Repeatable',audit:'Versioned inputs'}}]" />
