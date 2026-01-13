---
status: open
priority: normal
scheduled: 2026-01-13T08:30
contexts:
  - college
timeEstimate: 70
dateCreated: 2026-01-13T08:29:09.790-05:00
dateModified: 2026-01-13T08:29:44.159-05:00
reminders:
  - id: rem_1768310891707_u4y988pnw
    type: relative
    relatedTo: due
    offset: -PT15M
class:
  - course
  - task
tags:
  - university
code: CS3060
professor: "[[Joshua Bongard]]"
crn: "50271"
location:
  - INNOVATION HALL E430
semester: Spring 2026
image:
credits: 3
source:
  - https://brightspace.uvm.edu/d2l/home/149636
related:
author:
description:
date: 2026-01-13T08:29:09-05:00
updated: 2026-01-13T08:34:31-05:00
---

## Syllabus

Instructor: Josh Bongard jbongard@uvm.edu [Office Hours](https://docs.google.com/spreadsheets/d/1fKtTtqa10mFrVS7mXy5VprQsMAsnQmkk0e9uvfUU5TY/edit?usp=sharing).

T.A.: Nate Gaylinn nathaniel.gaylinn@uvm.edu [Office Hours](https://docs.google.com/spreadsheets/d/1URqmPok1Ih6HeJMyPv5KyyoU2mXLbLVSt5SYloUsO6E/edit?gid=1186233328#gid=1186233328).

1. Description: This course will explore the automated design of autonomous machines using evolutionary algorithms. The course will cover relevant topics in evolutionary computation, artificial neural networks, robotics, biomechanics, simulation and computer designed organisms. Students will conduct a major Python programming project that will span the course and thus provide hands-on experience with the topics covered. Students will use their developed system to perform a pre-specified evolutionary robotics experiment.
2. Learning outcomes:
3. Ability to design and simulate robot controllers
4. Proficiency in using robot simulation tools to test and evaluate robot performance
5. Understanding of the limitations and challenges of robot simulation
6. Ability to evaluate and compare the performance of different robot designs and control strategies using simulation
7. Familiarity with different evolutionary algorithms and their strengths and weaknesses
8. Tools: 
9. Brightspace will store materials, accept uploaded work, and administer quizzes.
10. Teams will be used for all Q&A between instructor, T.A. and students.
11. In-person lectures will be recorded and made available on YouTube.
12. Reddit will be used for providing coding assignment instructions.
13. Google Sheets will be used for taking attendance.
14. Students will maintain their code base on Github.
15. No laptops or phones may be used during class to provide a distraction free classroom. All notetaking must be done with pen and paper. See [this](https://goo.gl/mdEpUH) and [this](https://goo.gl/QTTkmZ) rationale.
16. Lectures.
17. Each in-person lecture is recorded live and posted to YouTube right after class. During lecture, it is assumed that if you volunteer a question, or answer a question verbally during lecture, that you are tacitly agreeing to being recorded.
18. Versions of the lecture slides are posted online before class on the [schedule](https://docs.google.com/spreadsheets/d/1zqH5Q5UP5kIOzS2l0GxbGSZkDRVODLv6hK2QTayR-4I/edit?usp=sharing). These versions are incomplete versions of those displayed by the instructor. It is expected that you annotate them as the class proceeds, or watch the video lecture after class and annotate the slides then. (For most accommodation students, this obviates the need for a note taker. However, if you still feel you need a note taker, please let the instructor know.)
19. Optional Textbook: Floreano, D. & Mattiussi, C. (2008) Bio-Inspired Artificial Intelligence: Theories, Methods, and Technologies, MIT Press. (Selected readings will be available as PDFs.)
20. Supplementary (Optional) Textbook: Pfeifer, R. & Bongard, J. (2007) How The Body Shapes the Way we Think: A New View of Intelligence, MIT Press. (Selected readings will be available as PDFs.)

Additional readings from the current literature will be provided.

  

8. Prerequisites: Junior standing and programming experience, or instructor permission.
9. Grading Scheme: The late policy for this class is as follows: material one day late, 25% deduction; two days late, 50% deduction; three days late, 100% reduction.

- The percent to letter grade conversion is as follows: 
    

1. A+ (97–100), A (93–96), A- (90–92), 
2. B+ (87–89), B (83–86), B- (80–82), 
3. C+ (77–79), C (73–76), C- (70–72), 
4. D+ (67–69), D (63–66), D- (60-62), 
5. F (below 60).
6. Ten programming assignments (10×4=40%): Over the span of ten weeks, each student will gradually build a software system that allows them to conduct an evolutionary robotics experiment. Note: Because the software will form a final, integrated system, if you fail to hand in one assignment, you must hand it in along with the new assignment the following week. 
7. Quizzes (25%): After each class, a multiple-choice quiz will be posted on Brightspace. This quiz should only take 10 minutes, assuming that you attended the lecture or watched the recording, and that you completed the reading for that day. The quiz must be taken by 11:59pm that day.
8. Final project (30%): Over the final four weeks of the semester, each student will use their software system to perform an evolutionary robotics experiment. Several weekly deliverables will be submitted, a written report describing the experiment will be handed in at the end of the semester, and an oral presentation will be given during the exam period.
9. Participation (5%): Class participation counts toward your final grade. Students are permitted to miss up to and including three classes without being required to provide justification. Missed classes beyond that must be cleared with the instructor. Participation is tracked with attendance sheets.
10. If you attend in-person lectures, an attendance sheet URL will be displayed at the beginning of class. With your device, mark yourself as present. Then, please re-stow your phone.
11. If you watch recorded lectures, an attendance sheet URL will flash up somewhere, at random, in the recorded lecture. Mark yourself as present.
12. This system is designed to not penalize anyone for attending remotely.
13. It is also designed as a gentle, continuous prod to keep up with lectures and readings.

## Schedule

| Day   | Date            | Section                        | Lecture  | title                                                                                                                                    | Ugrads | Grads | Recording | Reading                                                                                                                                                                                       |
| ----- | --------------- | ------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tues  | 1/13/2026       | 1. Introduction                | L01      | [Course logistics; why robots?](https://docs.google.com/presentation/d/1rHmg5Ve6zI28O8Qz6z8Q4lVQILIuRfmMMuXQ3A6zQB8/edit?usp=drive_link) | Q1     | Q1    |           | ["Evolutionary Robotics"](https://meclab.w3.uvm.edu/papers/2013_CACM_Bongard.pdf)                                                                                                             |
| Thurs | 1/15/2026       |                                | L02      | A short history of AI                                                                                                                    |        |       |           | [](https://drive.google.com/file/d/1dyg3-Zyv3Nv6MyAT0cJ3hnWfDOwpjDaf/view?usp=sharing)[Reading, pp. 5-11](https://drive.google.com/file/d/1dyg3-Zyv3Nv6MyAT0cJ3hnWfDOwpjDaf/view?usp=sharing) |
| Tues  | 1/20/2026       |                                | L03      | Embodied cognition                                                                                                                       |        |       |           |                                                                                                                                                                                               |
| Thurs | 1/22/2026       | 2. Tools of the trade          | L04      | Artificial neural networks                                                                                                               |        |       |           |                                                                                                                                                                                               |
| Tues  | 1/27/2026       |                                | L05      | Evolutionary algorithms                                                                                                                  |        |       |           |                                                                                                                                                                                               |
| Thurs | 1/29/2026       |                                | L06      | Physical simulation                                                                                                                      |        |       |           |                                                                                                                                                                                               |
| Tues  | 2/3/2026        | 3. History                     | L07      | The First Years of Evolutionary Robotics                                                                                                 |        |       |           |                                                                                                                                                                                               |
| Thurs | 2/5/2026        |                                | L08      | CTRNNs                                                                                                                                   |        |       |           |                                                                                                                                                                                               |
| Tues  | 2/10/2026       |                                | L09      | Minimal Cognition                                                                                                                        |        |       |           |                                                                                                                                                                                               |
| Thurs | 2/12/2026       |                                | L10      | Active Categorical Perception                                                                                                            |        |       |           |                                                                                                                                                                                               |
| Tues  | 2/17/2026       | 4. Locomotion                  | L11      | Legged Locomotion                                                                                                                        |        |       |           |                                                                                                                                                                                               |
| Thurs | 2/19/2026       |                                | L12      | Bipedal Locomotion                                                                                                                       |        |       |           |                                                                                                                                                                                               |
| Tues  | 2/24/2026       | Challenge 5.1: Encodings       | L13      | NEAT / HyperNEAT                                                                                                                         |        |       |           |                                                                                                                                                                                               |
| Thurs | 2/26/2026       | C5.2: Crossing the reality gap | L14      | The GOLEM Project                                                                                                                        |        |       |           |                                                                                                                                                                                               |
| Thurs | 3/5/2026        |                                | L15      | Resilient Machines                                                                                                                       |        |       |           |                                                                                                                                                                                               |
| Tues  | 3/17/2026       |                                | L16      | Transferability                                                                                                                          |        |       |           |                                                                                                                                                                                               |
| Thurs | 3/19/2026       | C5.3: Scalability              | L17      | Self-replicating robots                                                                                                                  |        |       |           |                                                                                                                                                                                               |
| Tues  | 3/24/2026       | 6. Collective robotics         | L18      | Swarm Robotics                                                                                                                           |        |       |           |                                                                                                                                                                                               |
| Thurs | 3/26/2026       |                                | L19      | The Evolution of Communication                                                                                                           |        |       |           |                                                                                                                                                                                               |
| Tues  | 3/31/2026       | 7. Evolving Bodies & Brains    | L20      | Rigid Robots                                                                                                                             |        |       |           |                                                                                                                                                                                               |
| Thurs | 4/2/2026        |                                | L21      | Soft Robots                                                                                                                              |        |       |           |                                                                                                                                                                                               |
| Tues  | 4/7/2026        |                                | L22      | Differentiable Robots                                                                                                                    |        |       |           |                                                                                                                                                                                               |
| Thurs | 4/9/2026        |                                | L23      | Meta-robots                                                                                                                              |        |       |           |                                                                                                                                                                                               |
| Tues  | 4/14/2026       |                                | L24      | Biological Robots ("xenobots")                                                                                                           |        |       |           |                                                                                                                                                                                               |
|       |                 |                                |          |                                                                                                                                          |        |       |           |                                                                                                                                                                                               |
|       | Day before exam |                                | 11:59 PM | Written report and oral presentation due                                                                                                 |        |       |           |                                                                                                                                                                                               |
|       | Exam period     |                                | 7:30 AM  | Final project presentations                                                                                                              |        |       |           |                                                                                                                                                                                               |
