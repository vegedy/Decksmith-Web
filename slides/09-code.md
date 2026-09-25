---
layout: default
title: Code and scientific context
---

# Code and scientific context

<CodeBlock filename="entropy.ts" language="TypeScript" :focus="[2]">

```ts
function information(probability: number): number {
  return probability === 0 ? 0 : -Math.log2(probability)
}
```

</CodeBlock>

<Callout kind="assumption" title="Probability domain">Inputs are probabilities between zero and one.</Callout>

<GlossaryTerm term="Entropy" definition="Expected information of a distribution." source="shannon1948" />
