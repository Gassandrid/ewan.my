---
author:
  - "[[Artem Kirsanov]]"
published: 2025-03-31
source: https://www.youtube.com/watch?v=q7seckj1hwM&t=556s
image: https://i.ytimg.com/vi/q7seckj1hwM/maxresdefault.jpg
class: video
tags:
  - youtube
related:
  - "[[Linear and Nonlinear Regression]]"
  - "[[Mean Squared Error]]"
date: 2026-01-21 08:39:17-05:00
updated: 2026-01-21 08:40:41-05:00
status: done
---
![What Textbooks Don't Tell You About Curve Fitting](https://www.youtube.com/embed/q7seckj1hwM)

> [!summary]- Description
> Head to <https://squarespace.com/artem> to save 10% off your first purchase of a website or domain using code ARTEMKIRSANOV
> 
> Socials:
> X/Twitter: <https://x.com/ArtemKRSV>
> Patreon:  <https://patreon.com/artemkirsanov>
> 
> My name is Artem, I'm a graduate student at NYU Center for Neural Science and researcher at Flatiron Institute.
> 
> In this video we dive deep into a probabilistic interpretation behind the core linear regression algorithm from the ground up. We talk about how the least squares objective naturally arises when we try to maximize the probability of observed data under the model, and how the square is a result of assuming Gaussian distribution of the noise in the samples. We also explore how incorporating prior beliefs about the distribution of model parameters leads to different kinds of regularization in objective functions.
> 
> Outline:
> 00:00 Introduction
> 01:16 What is Regression
> 02:11 Fitting noise in a linear model
> 06:02 Deriving Least Squares
> 07:46 Sponsor: Squarespace
> 09:04 Incorporating Priors
> 12:06 L2 regularization as Gaussian Prior
> 14:30 L1 regularization as Laplace Prior
> 16:16 Putting all together

> [!note]- Transcript (Youtube)
> ## Introduction
> 
> 0:00
> 
> this video was brought to you by
> 
> 0:01
> 
> Squarespace there is one Concept in
> 
> 0:03
> 
> machine learning that nearly every
> 
> 0:05
> 
> course in textbook starts with finding
> 
> 0:08
> 
> the equation of a straight line that
> 
> 0:10
> 
> best fits a scatter of
> 
> 0:12
> 
> points the typical explanation goes
> 
> 0:14
> 
> something like this we pick the line's
> 
> 0:17
> 
> parameters to minimize the average
> 
> 0:19
> 
> squared vertical distance from each
> 
> 0:21
> 
> point but why vertical distances why
> 
> 0:24
> 
> squares and not absolute values or some
> 
> 0:27
> 
> other power where does that even come
> 
> 0:29
> 
> from
> 
> 0:30
> 
> you'll often hear justifications like
> 
> 0:33
> 
> squares are easier to optimize or the
> 
> 0:35
> 
> math just works out nicely Fair points
> 
> 0:38
> 
> but to me that always felt somewhat
> 
> 0:41
> 
> unsatisfying in this video I want to
> 
> 0:43
> 
> share with you an alternative
> 
> 0:45
> 
> perspective a probabilistic take on
> 
> 0:48
> 
> linear regression that finally made
> 
> 0:50
> 
> everything click for me it leads to the
> 
> 0:53
> 
> same solution but offers a conceptual
> 
> 0:55
> 
> shift that I found invaluable not only
> 
> 0:58
> 
> does it answer those fundamental
> 
> 1:00
> 
> questions it also connects the seemingly
> 
> 1:03
> 
> simple problem to more complex topics
> 
> 1:05
> 
> like generative modeling and parameter
> 
> 1:08
> 
> regularizations in ways that might
> 
> 1:10
> 
> surprise you let's Dive Right
> 
> 1:13
> 
> \[Music\]
> 
> 1:15
> 
> In let's first clarify what regression
> 
> ## What is Regression
> 
> 1:18
> 
> actually means at its core it's about
> 
> 1:21
> 
> uncovering a relationship between inputs
> 
> 1:23
> 
> call them X and outputs y then using
> 
> 1:27
> 
> that relationship to predict y for new
> 
> 1:30
> 
> values of X unlike classification where
> 
> 1:33
> 
> you are choosing between discrete
> 
> 1:35
> 
> categories like yes and no regression
> 
> 1:38
> 
> deals with continuous values a classic
> 
> 1:40
> 
> example is predicting house price from
> 
> 1:43
> 
> various features perhaps X1 is the
> 
> 1:46
> 
> number of bedrooms X2 distance to the
> 
> 1:48
> 
> subway Etc our task is to reconstruct
> 
> 1:52
> 
> the price from these features at this
> 
> 1:55
> 
> point most explanations jump directly to
> 
> 1:57
> 
> minimizing squar errors in the line by
> 
> 2:00
> 
> reducing those vertical gaps and yes
> 
> 2:03
> 
> we'll get there but to truly understand
> 
> 2:05
> 
> why this works let's step back and
> 
> 2:08
> 
> reframe it through
> 
> ## Fitting noise in a linear model
> 
> 2:11
> 
> probability let's treat our data as if
> 
> 2:14
> 
> it emerges from a linear model plus some
> 
> 2:17
> 
> noise imagine that somewhere in the
> 
> 2:19
> 
> universe underlying source code the
> 
> 2:22
> 
> ideal price of each house is given
> 
> 2:24
> 
> precisely by a linear combination of
> 
> 2:26
> 
> features weighted by some coefficients
> 
> 2:30
> 
> for brevity let's Express this as the
> 
> 2:32
> 
> dot product between weights and features
> 
> 2:35
> 
> stacked into
> 
> 2:36
> 
> vectors however real world data is messy
> 
> 2:39
> 
> and it never perfectly follows the
> 
> 2:41
> 
> linear patterns actual house prices are
> 
> 2:44
> 
> influenced not just by those features we
> 
> 2:46
> 
> collected but also by hidden variables
> 
> 2:49
> 
> that we can't access Plus Market
> 
> 2:51
> 
> fluctuations and human
> 
> 2:53
> 
> behavior in other words our observed
> 
> 2:56
> 
> values y are corrupted versions of those
> 
> 2:59
> 
> ideal underlying values with noise term
> 
> 3:02
> 
> Epsilon being added to them here Epsilon
> 
> 3:05
> 
> represents everything we can't explain
> 
> 3:08
> 
> with our features all the unknown
> 
> 3:10
> 
> contributors to the price beyond our
> 
> 3:12
> 
> control the critical Insight is that our
> 
> 3:15
> 
> resulting regression equation depends on
> 
> 3:18
> 
> our assumptions about this noise namely
> 
> 3:21
> 
> Epsilon is shaped by countless tiny
> 
> 3:23
> 
> inferences measurement errors untrack
> 
> 3:26
> 
> variables random Market fluctuations all
> 
> 3:28
> 
> added together when many small
> 
> 3:31
> 
> independent effects accumulate
> 
> 3:33
> 
> additively something remarkable happens
> 
> 3:36
> 
> according to the central limit theorem
> 
> 3:38
> 
> when you sum many independent random
> 
> 3:40
> 
> variables regardless of their individual
> 
> 3:43
> 
> distributions their sum approaches a
> 
> 3:46
> 
> normal or gorion distribution The
> 
> 3:48
> 
> Familiar B curve suppose we have a
> 
> 3:51
> 
> candidate set of Weights W our
> 
> 3:54
> 
> hypothesis about the underlying linear
> 
> 3:56
> 
> model when we examine a random house
> 
> 4:00
> 
> with features X and price y we can
> 
> 4:03
> 
> calculate exactly how much noise was
> 
> 4:05
> 
> added to our hypothesis by taking the
> 
> 4:08
> 
> difference between the observed price Y
> 
> 4:11
> 
> and its ideal non-noise value with our
> 
> 4:14
> 
> noise model knowing that it follows a
> 
> 4:17
> 
> caution distribution we can calculate
> 
> 4:20
> 
> the probability of getting precisely the
> 
> 4:23
> 
> right amount of noise Epsilon that would
> 
> 4:25
> 
> push the underlying price to be
> 
> 4:27
> 
> registered as y this equals the
> 
> 4:30
> 
> probability of observing that particular
> 
> 4:32
> 
> data point I want to reiterate that
> 
> 4:35
> 
> shift of perspective with a working set
> 
> 4:38
> 
> of Weights w we take the features X and
> 
> 4:41
> 
> compute their weighted sum given us
> 
> 4:43
> 
> where the ideal noiseless version of Y
> 
> 4:46
> 
> should lie around this point exists a
> 
> 4:49
> 
> cloud of uncertainty a bell curve
> 
> 4:52
> 
> centered at w transpose X when we
> 
> 4:55
> 
> observe the actual value of y and
> 
> 4:58
> 
> calculate how much much noise must have
> 
> 5:00
> 
> been added we can compute the likelihood
> 
> 5:03
> 
> of that happening by plugging the noise
> 
> 5:06
> 
> amplitude into the gor equation this
> 
> 5:09
> 
> gives us the probability of observing a
> 
> 5:11
> 
> single data point as the probability of
> 
> 5:14
> 
> sampling just the right amount of noise
> 
> 5:16
> 
> from the caution
> 
> 5:18
> 
> distribution if we assume all data
> 
> 5:21
> 
> points in our scatter plot were sampled
> 
> 5:24
> 
> independently then the probability of
> 
> 5:26
> 
> obtaining our entire data set with a
> 
> 5:28
> 
> fixed w
> 
> 5:30
> 
> can be found by multiplying the
> 
> 5:32
> 
> probabilities of these independent
> 
> 5:34
> 
> events what we have done is expressed
> 
> 5:37
> 
> the probability of observing our data
> 
> 5:39
> 
> given a particular model the
> 
> 5:41
> 
> coefficients W if presented with two
> 
> 5:44
> 
> alternative models intuitively the
> 
> 5:47
> 
> better model would be the one with a
> 
> 5:49
> 
> higher probability of generating The
> 
> 5:51
> 
> observed data so when solving the
> 
> 5:54
> 
> regression problem and choosing the
> 
> 5:56
> 
> optimal w we just need to select the
> 
> 5:59
> 
> configuration that maximizes this
> 
> 6:01
> 
> probability given this optimization
> 
> ## Deriving Least Squares
> 
> 6:04
> 
> objective we can expand the formula for
> 
> 6:06
> 
> the probability of data now let's take
> 
> 6:09
> 
> the logarithm of the right hand side
> 
> 6:12
> 
> because logarithm is a monotonic
> 
> 6:14
> 
> function whichever weight configuration
> 
> 6:16
> 
> maximizes the total probability also
> 
> 6:19
> 
> maximizes its logarithm the two
> 
> 6:21
> 
> objectives are equivalent but the
> 
> 6:23
> 
> logarithm transforms our product of
> 
> 6:26
> 
> probabilities into a sum which is much
> 
> 6:28
> 
> easier to work with
> 
> 6:31
> 
> notice that Sigma the amplitude of the
> 
> 6:33
> 
> underlying noise is a fixed value
> 
> 6:36
> 
> determined by factors like Market
> 
> 6:38
> 
> volatility from the perspective of the
> 
> 6:40
> 
> optimization objective it is a constant
> 
> 6:43
> 
> factor that doesn't affect which set of
> 
> 6:45
> 
> Weights is optimal this allows us to
> 
> 6:48
> 
> simplify the formula finally the
> 
> 6:51
> 
> logarithm and the exponent cancel each
> 
> 6:53
> 
> other out leaving us with this this is
> 
> 6:57
> 
> exactly the well-known least squares of
> 
> 6:59
> 
> objective which states that the optimal
> 
> 7:02
> 
> coefficients should maximize the
> 
> 7:04
> 
> negative or minimize the positive of the
> 
> 7:07
> 
> sum of squared errors between the linear
> 
> 7:10
> 
> fit and The observed points importantly
> 
> 7:14
> 
> though we arrived at this from the
> 
> 7:15
> 
> perspective of finding the linear model
> 
> 7:18
> 
> that maximizes the probability of
> 
> 7:20
> 
> observing our data and the square in the
> 
> 7:23
> 
> resulting formula is a direct
> 
> 7:25
> 
> consequence of assuming the Gau
> 
> 7:28
> 
> noise this problem can be then solved
> 
> 7:30
> 
> either through gradient descent by
> 
> 7:32
> 
> making small iterative adjustments to
> 
> 7:34
> 
> the weights or by directly jumping to
> 
> 7:37
> 
> this solution using a closed form
> 
> 7:39
> 
> expression found in any textbook my main
> 
> 7:42
> 
> goal here was to show where this formula
> 
> 7:44
> 
> comes from in the first
> 
> 7:45
> 
> place just like linear regression helps
> 
> ## Sponsor: Squarespace
> 
> 7:48
> 
> us find the optimal fit for the data
> 
> 7:51
> 
> finding the right platform for your
> 
> 7:52
> 
> online presence is all about making
> 
> 7:54
> 
> smart choices which brings me to our
> 
> 7:57
> 
> today's sponsor Squarespace Squarespace
> 
> 8:00
> 
> transforms website creation and
> 
> 8:02
> 
> management into a straightforward
> 
> 8:04
> 
> process that anyone can Master while
> 
> 8:06
> 
> starting a site from scratch might seem
> 
> 8:08
> 
> challenging Squarespace design
> 
> 8:10
> 
> intelligence feature makes it remarkably
> 
> 8:12
> 
> simple this Innovative AI power tool kit
> 
> 8:16
> 
> generates a website tailored to your
> 
> 8:18
> 
> specific business in brand Vision filled
> 
> 8:20
> 
> with relevant content and images from
> 
> 8:23
> 
> this starting point you can enjoy total
> 
> 8:25
> 
> creative freedom adjust all the visual
> 
> 8:27
> 
> elements to match your style organize
> 
> 8:29
> 
> content with their drag and drop tools
> 
> 8:31
> 
> and even Implement ey catch in
> 
> 8:33
> 
> animations to spice things up
> 
> 8:35
> 
> importantly Squarespace goes beyond just
> 
> 8:37
> 
> website building it's a comprehensive
> 
> 8:39
> 
> digital solution where you can develop
> 
> 8:41
> 
> online courses launch effective email
> 
> 8:44
> 
> campaigns or set up payment processing
> 
> 8:46
> 
> through various methods all within one
> 
> 8:49
> 
> cohesive ecosystem experience it
> 
> 8:51
> 
> yourself with a free trial at
> 
> 8:53
> 
> squarespace.com and once you're ready to
> 
> 8:55
> 
> launch visit squarespace.com AUM to save
> 
> 8:59
> 
> 10 % off your first purchase of a
> 
> 9:01
> 
> website or
> 
> ## Incorporating Priors
> 
> 9:04
> 
> domain previously when choosing between
> 
> 9:06
> 
> different sets of Weights w we always
> 
> 9:09
> 
> pick the model with a higher probability
> 
> 9:11
> 
> of generating The observed data the
> 
> 9:13
> 
> lower means squared error but what if
> 
> 9:16
> 
> two models have identical values for
> 
> 9:19
> 
> that probability but differ in their
> 
> 9:21
> 
> exact values for w would we have a
> 
> 9:24
> 
> reason to prefer one over the
> 
> 9:26
> 
> other if we know nothing about the
> 
> 9:28
> 
> nature of of our features we have no
> 
> 9:31
> 
> basis of comparing two equally
> 
> 9:33
> 
> performing models but often we have
> 
> 9:35
> 
> prior expectations about how features
> 
> 9:37
> 
> might contribute to the predictions and
> 
> 9:40
> 
> thus we have reasonable boundaries for
> 
> 9:42
> 
> their values let's illustrate it with an
> 
> 9:45
> 
> example suppose we have a coin with an
> 
> 9:48
> 
> unknown bias where the probability of
> 
> 9:51
> 
> heads is Theta between 0 and 1 we want
> 
> 9:54
> 
> to estimate this value of theta by
> 
> 9:56
> 
> tossing the coin and tracking the
> 
> 9:58
> 
> results let's say we observe four hats
> 
> 10:01
> 
> out of five tosses if we ignore any
> 
> 10:04
> 
> assumptions about Theta and find the
> 
> 10:06
> 
> value that maximizes the probability of
> 
> 10:09
> 
> data we will conclude that Theta must be
> 
> 10:13
> 
> 0.8 indeed this type of biased coin
> 
> 10:16
> 
> maximizes the probability of observing
> 
> 10:18
> 
> four heads out of five tosses but
> 
> 10:21
> 
> something doesn't seem right we know
> 
> 10:23
> 
> from experience that most coins
> 
> 10:25
> 
> typically land 50/50 maybe with a slight
> 
> 10:28
> 
> bias due to a symmetry but certainly not
> 
> 10:31
> 
> 80 to
> 
> 10:32
> 
> 20 the problem is that our solution only
> 
> 10:35
> 
> cared about maximizing the probability
> 
> 10:38
> 
> of observed beta and completely ignored
> 
> 10:41
> 
> prior beliefs about Theta which likely
> 
> 10:43
> 
> is centered around 0.5 and decreases
> 
> 10:46
> 
> towards the edges but is there a
> 
> 10:49
> 
> systematic way to incorporate these
> 
> 10:51
> 
> prior assumptions into our regression
> 
> 10:54
> 
> objective instead of maximizing the
> 
> 10:57
> 
> probability of data we can search for a
> 
> 10:59
> 
> set of Weights W that maximizes the
> 
> 11:02
> 
> joint probability of data and the
> 
> 11:04
> 
> weights in other words we look for
> 
> 11:07
> 
> weights that both explain the data well
> 
> 11:09
> 
> and align with our prior beliefs about
> 
> 11:12
> 
> what w should look like following the
> 
> 11:15
> 
> conditional probability rule we can
> 
> 11:17
> 
> decompose the total probability into the
> 
> 11:19
> 
> following product the first factor is
> 
> 11:22
> 
> the likelihood exactly what we had
> 
> 11:24
> 
> before How likely a particular W is to
> 
> 11:27
> 
> have generated our observed dat AA given
> 
> 11:30
> 
> by the Cent formula for the noise the
> 
> 11:33
> 
> second factor is the prior where we
> 
> 11:35
> 
> incorporate assumptions about How likely
> 
> 11:37
> 
> different values of w are the key idea
> 
> 11:41
> 
> is that different assumptions on prior
> 
> 11:44
> 
> distributions of Weights will lead to
> 
> 11:46
> 
> different criteria how to choose between
> 
> 11:48
> 
> alternative Solutions this shows up in
> 
> 11:51
> 
> the overall objective as so called
> 
> 11:53
> 
> regularization terms for the remainder
> 
> 11:56
> 
> of the video I'd like to focus on two
> 
> 11:58
> 
> most common types of regularization and
> 
> 12:01
> 
> show how they are born from two common
> 
> 12:05
> 
> priors one of the most popular choices
> 
> ## L2 regularization as Gaussian Prior
> 
> 12:08
> 
> is to assume that weights W themselves
> 
> 12:11
> 
> follow a zeroc centered caution
> 
> 12:14
> 
> distribution why is that reasonable well
> 
> 12:17
> 
> in regression each component of w is a
> 
> 12:20
> 
> coefficient describing how a particular
> 
> 12:22
> 
> feature in the X Vector like the size of
> 
> 12:25
> 
> the house contributes to the prediction
> 
> 12:27
> 
> y if we randomly select features
> 
> 12:31
> 
> intuitively most will be probably
> 
> 12:33
> 
> irrelevant with values near zero while
> 
> 12:36
> 
> only a small subset will have
> 
> 12:38
> 
> significant weights additionally since
> 
> 12:41
> 
> each feature's coefficient in real data
> 
> 12:43
> 
> is shaped by many underly unobserved
> 
> 12:46
> 
> causes the central limit theorem applies
> 
> 12:48
> 
> to the coefficients as well formally we
> 
> 12:52
> 
> can write that the prior probability of
> 
> 12:55
> 
> observing a particular set of Weights is
> 
> 12:57
> 
> given by the product of probab ities of
> 
> 12:59
> 
> individual components Each of which is
> 
> 13:02
> 
> given by the Gan formula with some
> 
> 13:04
> 
> variance
> 
> 13:06
> 
> tow now going back to our optimization
> 
> 13:09
> 
> objective we want to maximize The Joint
> 
> 13:12
> 
> probability let's take the logarithm as
> 
> 13:15
> 
> before and substitute our formulas for
> 
> 13:18
> 
> the likelihood and the
> 
> 13:19
> 
> prior flipping the signs and grouping
> 
> 13:22
> 
> the two constants together we get the
> 
> 13:25
> 
> following this is what's known as rid
> 
> 13:28
> 
> regression or for L2 regularized linear
> 
> 13:31
> 
> regression due to the square of the
> 
> 13:33
> 
> weight
> 
> 13:34
> 
> amplitudes the idea is that we are
> 
> 13:36
> 
> searching for the model that would both
> 
> 13:38
> 
> explain the data well but at the same
> 
> 13:41
> 
> time be not overly complex where
> 
> 13:43
> 
> complexity is measured as the sum of
> 
> 13:46
> 
> squares of the weights this
> 
> 13:48
> 
> regularization term penalizes large
> 
> 13:50
> 
> weight values pushing them toward zero
> 
> 13:54
> 
> exactly what we would expect from our
> 
> 13:56
> 
> gion prior assumption notice how beauti
> 
> 13:59
> 
> this emerges the parameter Lambda which
> 
> 14:02
> 
> controls how strong the regularization
> 
> 14:04
> 
> is is the ratio between the data noise
> 
> 14:07
> 
> or the variance of the samples and the
> 
> 14:09
> 
> variance of the prior distribution of
> 
> 14:12
> 
> coefficients when we are very certain
> 
> 14:14
> 
> about our prior Lambda becomes larger
> 
> 14:17
> 
> given more weight to the regularization
> 
> 14:19
> 
> term conversely when the data is very
> 
> 14:22
> 
> reliable with small variance Lambda
> 
> 14:25
> 
> decreases placing more emphasis on
> 
> 14:28
> 
> fitting the data
> 
> ## L1 regularization as Laplace Prior
> 
> 14:31
> 
> but what if our intuition about the
> 
> 14:33
> 
> weights is different instead of just
> 
> 14:36
> 
> assuming they are generally small what
> 
> 14:38
> 
> if we believe most should be exactly
> 
> 14:41
> 
> zero with only a few significant ones
> 
> 14:44
> 
> this would correspond to a model where
> 
> 14:46
> 
> only a handful of features truly matter
> 
> 14:49
> 
> favoring sparse
> 
> 14:51
> 
> Solutions this assumption is
> 
> 14:53
> 
> particularly relevant for biological
> 
> 14:55
> 
> systems in genomics for example out of
> 
> 14:58
> 
> thousand of genes only a small subset
> 
> 15:01
> 
> typically influences a particular trait
> 
> 15:04
> 
> similarly for Neuroscience only a small
> 
> 15:07
> 
> sparse subset of all neurons are
> 
> 15:10
> 
> responsible for encoding a particular
> 
> 15:12
> 
> feature in this case a gan prior is not
> 
> 15:15
> 
> ideal because it pushes weights towards
> 
> 15:17
> 
> zero too gently instead we might prefer
> 
> 15:20
> 
> a distribution with a sharp Peak at zero
> 
> 15:23
> 
> which looks something like this this is
> 
> 15:26
> 
> known as the LL distribution and it is
> 
> 15:29
> 
> parametrized by symmetric exponentially
> 
> 15:31
> 
> Fallen
> 
> 15:32
> 
> tails the probability of the
> 
> 15:34
> 
> configuration of W's as a whole can be
> 
> 15:37
> 
> found by multiplying the probabilities
> 
> 15:39
> 
> of each component and following the same
> 
> 15:42
> 
> derivation as before taking the
> 
> 15:44
> 
> logarithm to counteract the exponent our
> 
> 15:47
> 
> optimization objective becomes the
> 
> 15:49
> 
> following here Lambda is again the
> 
> 15:52
> 
> combination of constance of noise
> 
> 15:53
> 
> variance and the falloff of the weights
> 
> 15:56
> 
> prior this is known as L1 regular
> 
> 15:59
> 
> ization because the complexity penalizes
> 
> 16:01
> 
> the absolute values of w rather than
> 
> 16:04
> 
> their squares L1 regularization
> 
> 16:07
> 
> typically leads to sparse Solutions
> 
> 16:10
> 
> where many weights are exactly zero
> 
> 16:13
> 
> which is preferable in many domains of
> 
> ## Putting all together
> 
> 16:16
> 
> science all right let's tie everything
> 
> 16:19
> 
> together today we explored the
> 
> 16:21
> 
> probabilistic view of linear regression
> 
> 16:23
> 
> and saw how the familiar least squares
> 
> 16:25
> 
> equation naturally emerges when we find
> 
> 16:28
> 
> the linear fit that maximizes the
> 
> 16:30
> 
> probability of observing our data
> 
> 16:33
> 
> importantly the squared error term
> 
> 16:36
> 
> wasn't just an arbitrary Choice it is a
> 
> 16:39
> 
> direct consequence of assuming caution
> 
> 16:41
> 
> noise in our model while this assumption
> 
> 16:44
> 
> is reasonable in most cases it may not
> 
> 16:47
> 
> be appropriate in specific settings
> 
> 16:49
> 
> where noise is correlated or
> 
> 16:51
> 
> multiplicative in nature we've also seen
> 
> 16:54
> 
> how incorporating prior beliefs about
> 
> 16:57
> 
> the coefficients lead to different
> 
> 16:59
> 
> regularization schemes providing a
> 
> 17:02
> 
> principled approach to balancing models
> 
> 17:05
> 
> accuracy with complexity the cion prior
> 
> 17:08
> 
> gave us L2 regularization gently pushing
> 
> 17:11
> 
> all weights toward zero while the llos
> 
> 17:14
> 
> prior yielded L1 regularization favoring
> 
> 17:18
> 
> sparse Solutions where most weights
> 
> 17:20
> 
> become exactly zero this probabilistic
> 
> 17:23
> 
> perspective extends far beyond linear
> 
> 17:26
> 
> regression to nearly all machine
> 
> 17:27
> 
> learning models
> 
> 17:29
> 
> whether examining deep neural networks
> 
> 17:31
> 
> as we saw in the previous video decision
> 
> 17:34
> 
> trees or clustering algorithms viewing
> 
> 17:36
> 
> them through the lens of probability
> 
> 17:38
> 
> provides a much deeper understanding of
> 
> 17:41
> 
> their underlying assumptions and design
> 
> 17:43
> 
> choices if you like the video share it
> 
> 17:45
> 
> with your friends subscribe to the
> 
> 17:47
> 
> channel if you haven't already and press
> 
> 17:49
> 
> the like button stay tuned for more
> 
> 17:51
> 
> neuroscience and machine learning topics
> 
> 17:53
> 
> coming up
> 
> 17:59
> 
> \[Music\]
> 
> 18:07
> 
> \[Music\]
