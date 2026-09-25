---
title: Explicit trust boundaries
---

# Explicit trust boundaries

<ArchitectureDiagram label="Local document retrieval" :nodes="[{id:'user',label:'Reader',x:90,y:145}, {id:'app',label:'Application',x:390,y:145}, {id:'store',label:'Index',x:680,y:145}]" :edges="[{from:'user',to:'app',label:'Query'}, {from:'app',to:'store',label:'Lookup'}]" :boundaries="[{id:'device',label:'Trusted local device',x:260,y:30,width:510,height:205}]" legend="Arrows show data flow. Dashed enclosure marks a trust boundary." />
