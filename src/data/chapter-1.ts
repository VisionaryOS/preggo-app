/**
 * CHAPTER 1: Understanding Pregnancy
 * 
 * This is an example chapter showing how to implement the template.
 * Replace this with your actual chapter content.
 */

import { Chapter } from './book-chapter-template';

const chapter: Chapter = {
  id: 1,
  title: "Understanding Pregnancy",
  slug: "understanding-pregnancy",
  summary: "An introduction to pregnancy, covering conception, key terminology, and what to expect in the coming months.",
  sections: [
    {
      title: "Introduction",
      key: "introduction",
      content: `
# Welcome to Your Pregnancy Journey

Pregnancy is an extraordinary time of change, growth, and anticipation. Whether this is your first pregnancy or you've experienced it before, each journey is unique.

This chapter aims to provide you with a **foundational understanding of pregnancy**—from conception to the major milestones ahead. We'll cover:

- Key terminology you'll encounter
- The changes happening in your body
- What to expect over the next nine months

[!INFO] How to Use This Guide
This resource is designed to supplement, not replace, the guidance from your healthcare providers. Always consult with your medical team about your specific situation.

> **💡 Remember:** Knowledge is empowering. Understanding the process can help you navigate this transformative time with confidence.
      `
    },
    {
      title: "Conception and Early Development",
      key: "conception",
      content: `
# From Fertilization to Implantation

Pregnancy begins at conception, when a sperm cell fertilizes an egg cell, typically in the fallopian tube. This creates a zygote—a single cell containing the complete genetic material for a new human being.

## The Journey Begins

1. **Fertilization (Day 1)**: Sperm meets egg in the fallopian tube
2. **Cell Division (Days 1-4)**: The zygote immediately begins dividing
3. **Blastocyst Formation (Days 4-5)**: Develops into a hollow ball of ~100 cells
4. **Implantation (Days 6-7)**: The blastocyst embeds in the uterine lining

[!DEFINITION] Zygote:
The single cell formed when a sperm fertilizes an egg, containing all the genetic material needed for a new human being.

This implantation process triggers hormonal changes that will support the pregnancy and eventually give you those first signs that you're expecting.

## Key Early Milestones

| Timeframe | Development |
|-----------|-------------|
| Week 3-4 | Positive pregnancy test possible |
| Week 5-6 | Embryonic heart begins to beat |
| Week 8 | All major organs have begun to form |
| Week 12 | End of first trimester; risk of miscarriage decreases significantly |

[!WARNING] When to Contact Your Doctor:
During early pregnancy, contact your healthcare provider immediately if you experience severe abdominal pain, heavy bleeding, or fever above 100.4°F (38°C).

> **⚠️ Important Note**: Pregnancy weeks are counted from the first day of your last menstrual period, not from conception. This means you're not actually pregnant during the first two weeks of pregnancy, as fertilization typically occurs around week 2-3.

[!QUIZ]
Question: When does pregnancy technically begin?
Options:
A. The first day of your last period
B. When the sperm fertilizes the egg (correct)
C. When the pregnancy test is positive
D. When the embryonic heart begins to beat
Explanation: While pregnancy timing is counted from the first day of your last period for clinical purposes, the actual biological process of pregnancy begins at conception when a sperm fertilizes an egg.
      `
    },
    {
      title: "Pregnancy Terminology",
      key: "terminology",
      content: `
# Understanding the Language of Pregnancy

Navigating pregnancy information can be overwhelming, especially with all the medical terminology. Here's a guide to some common terms you'll encounter:

## Essential Terms to Know

**Timeline Terms**
- **Gestation**: The period of development from conception to birth
- **Trimester**: The three approximately 13-week periods of pregnancy

**Development Terms**
- **Embryo**: Your developing baby from weeks 3-8
- **Fetus**: Your developing baby from week 9 until birth

[!TIP] Learning the Lingo:
When your healthcare provider uses a term you don't understand, don't hesitate to ask for clarification. There are no silly questions when it comes to understanding your pregnancy.

**Anatomical Terms**
- **Placenta**: The organ that provides oxygen and nutrients to your baby
- **Umbilical cord**: The lifeline connecting your baby to the placenta
- **Amniotic fluid**: The protective liquid surrounding your baby
- **Cervix**: The neck of the uterus that will dilate during labor

## Pregnancy Terminology Reference Table

Here's a comprehensive guide to common pregnancy terms and their significance throughout your journey:

| Term | Definition | When It's Relevant | Why It Matters |
|------|------------|-------------------|----------------|
| **Trimester** | Pregnancy divided into three ~13-week periods | Throughout pregnancy | Helps track developmental stages and expected changes |
| **Embryo** | Developing baby from weeks 3-8 | First trimester | Critical period when major organs form |
| **Fetus** | Developing baby from week 9 until birth | Second and third trimesters | Term used once basic structures are formed |
| **Placenta** | Organ that delivers nutrients and oxygen to baby | Forms in first trimester, critical throughout | Essential life-support system for your baby |
| **Amniotic Fluid** | Protective liquid surrounding the baby | Throughout pregnancy | Cushions baby, enables movement, supports lung development |
| **Amniotic Sac** | Membrane containing the amniotic fluid | Throughout pregnancy | Protects baby from infection and external pressure |
| **Cervix** | Lower part of uterus connecting to vagina | Changes throughout, crucial during labor | Thins and dilates to allow baby's passage during birth |
| **Effacement** | Thinning of the cervix | Late pregnancy and labor | Measured in percentages; must reach 100% for delivery |
| **Dilation** | Opening of the cervix | During labor | Measured in centimeters; full dilation is 10cm |
| **Braxton Hicks** | Practice contractions | Usually second trimester onward | Helps your body prepare for labor |
| **Quickening** | First baby movements felt | Usually 16-25 weeks | Confirms baby's activity and development |
| **Fundal Height** | Measurement from pubic bone to top of uterus | Second and third trimesters | Helps track baby's growth |
| **Colostrum** | First breast milk produced | Late pregnancy and after birth | Rich in antibodies and nutrients for newborn |

**Medical Procedures**
- **Ultrasound**: An imaging technique using sound waves to visualize your baby
- **Braxton Hicks**: Practice contractions that may occur, especially in later pregnancy

---

Understanding these terms will help you better communicate with healthcare providers and understand the information you'll receive throughout your pregnancy.

[!QUIZ]
Question: What is the difference between an embryo and a fetus?
Options:
A. There is no difference, they are interchangeable terms
B. An embryo is before birth, a fetus is after birth
C. An embryo is weeks 3-8, a fetus is week 9 until birth (correct)
D. An embryo is the first trimester, a fetus is the second and third trimesters
Explanation: The term embryo refers to the developing baby from weeks 3-8 of pregnancy when organs and essential structures are forming. From week 9 until birth, the developing baby is called a fetus, as it continues to mature and grow.
      `
    },
    {
      title: "Calculating Your Due Date",
      key: "due-date",
      content: `
# When Will You Meet Your Baby?

Your estimated due date (EDD) is calculated as 40 weeks from the first day of your last menstrual period. However, it's important to remember that this is just an estimate—**only about 5% of babies are born exactly on their due date**.

[!INFO] Due Date Flexibility:
A full-term pregnancy ranges from 37 to 42 weeks, giving your baby a 5-week window to arrive and still be considered on time.

A full-term pregnancy can range from 37 to 42 weeks. Your healthcare provider might adjust your due date based on:

- Ultrasound measurements (especially in the first trimester)
- The date of conception, if known
- The length of your typical menstrual cycle

## Due Date Calculator

If you want to calculate your due date yourself, follow this formula (Naegele's rule):

\`\`\`
1. Take the first day of your last period
2. Subtract 3 months
3. Add 7 days
\`\`\`

**Example Calculation:**
If your last period started on March 15:
- Subtract 3 months → December 15
- Add 7 days → December 22

This gives you an estimated due date of December 22.

## Probability of Birth by Week

| Week of Pregnancy | Likelihood of Delivery | Classification |
|-------------------|------------------------|----------------|
| Before Week 37    | ~10%                   | Preterm        |
| Week 37-38        | ~15%                   | Early Term     |
| Week 39-40        | ~50%                   | Full Term      |
| Week 40 (EDD)     | ~5%                    | Due Date       |
| Week 41           | ~15%                   | Late Term      |
| Week 42+          | ~5%                    | Post Term      |

[!SUCCESS] Ready for the Journey:
Now that you understand the basics of pregnancy timing and terminology, you're better equipped to navigate the next nine months with confidence!

> **💫 Remember**: Your due date is an estimate, not a deadline. Every pregnancy is unique, and your baby will arrive when they're ready.

---

**In the next chapter**, we'll explore the physical and emotional changes you can expect during the first trimester.
      `
    }
  ],
  images: [
    {
      url: "/images/resources/chapter-1/fetal-development.jpg",
      alt: "Illustration of fetal development stages",
      caption: "The stages of fetal development throughout pregnancy"
    }
  ],
  relatedResources: [
    {
      title: "Pregnancy Calendar Tool",
      url: "/tools/pregnancy-calendar",
      type: "tool"
    },
    {
      title: "First Trimester Checklist",
      url: "/resources/first-trimester-checklist",
      type: "article"
    },
    {
      title: "Video: Understanding Your Pregnancy Tests",
      url: "/resources/pregnancy-test-explained",
      type: "video"
    }
  ],
  tags: ["pregnancy", "first trimester", "conception", "development", "basics", "due date"],
  trimester: 1,
  week: [1, 2, 3, 4, 5, 6, 7, 8]
};

export default chapter; 