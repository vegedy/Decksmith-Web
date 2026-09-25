---
layout: default
title: Long equations
---

# Long equations

<Equation id="optimization" label="Long expressions: use aligned line breaks" compact>

$$
\begin{aligned}
\theta^\star &= \operatorname*{arg\,min}_{\theta \in \mathbb{R}^{d}}\mathcal{L}(\theta), \\
\mathcal{L}(\theta) &= -\frac{1}{N}\sum_{i=1}^{N}\sum_{k=1}^{K} y_{ik}\log P_\theta(Y=k\mid\mathbf{x}_i) \\
&\quad + \lambda\lVert\theta\rVert_2^2.
\end{aligned}
$$

</Equation>
