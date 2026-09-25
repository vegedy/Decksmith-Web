---
title: From input to evidence
---

# From input to evidence

<PipelineDiagram label="A reproducible evaluation pipeline" :steps="[{id:'data',label:'Collect',detail:'Versioned input'}, {id:'clean',label:'Validate',detail:'Schema and quality'}, {id:'score',label:'Evaluate',detail:'Held-out data'}, {id:'report',label:'Report',detail:'Uncertainty included'}]" />

<ProcessSteps label="Explain the procedure" sequential :steps="[{id:'split',label:'Split first',detail:'Prevent evaluation leakage'}, {id:'fit',label:'Fit on training data',detail:'Keep the test set unseen'}, {id:'test',label:'Report once',detail:'Preserve the evaluation protocol'}]" />
