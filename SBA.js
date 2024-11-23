const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

function getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions) {
  try {
    // course ID matches w/ CourseInfo and AssignmentGroup
    if (CourseInfo.id !== AssignmentGroup.course_id) {
      throw new Error(
        "The course ID does not match the assignment group's course ID."
      );
    }

    // submissions by learner ID
    let learners = {};
    for (let i = 0; i < LearnerSubmissions.length; i++) {
      let submission = LearnerSubmissions[i];
      if (!learners[submission.learner_id]) {
        learners[submission.learner_id] = [];
      }
      learners[submission.learner_id].push(submission);
    }

    //Calculate scores and averages
    let result = [];
    for (let learnerId in learners) {
      let totalScore = 0;
      let totalPointsPossible = 0;
      let individualScores = {};

      //each submission for the learner
      for (let i = 0; i < learners[learnerId].length; i++) {
        let submission = learners[learnerId][i];

        // Find assignment w/ loop
        let assignment = null;
        for (let j = 0; j < AssignmentGroup.assignments.length; j++) {
          if (AssignmentGroup.assignments[j].id === submission.assignment_id) {
            assignment = AssignmentGroup.assignments[j];
            break;
          }
        }

        if (assignment) {
          let score = submission.submission.score;
          const dueDate = new Date(assignment.due_at);
          const submittedDate = new Date(submission.submission.submitted_at);

          // late penalty 10% deduction
          if (submittedDate > dueDate) {
            score -= 0.1 * assignment.points_possible;
          }

          // score as a percentage
          individualScores[assignment.id] = score / assignment.points_possible;
          totalScore += score;
          totalPointsPossible += assignment.points_possible;
        } else {
          // If not found, assume 0 points for submission
          individualScores[submission.assignment_id] = 0;
        }
      }

      //Calculate the average score for learner
      const avg = totalScore / totalPointsPossible;

      // Push result for learner, assignment scores and the average
      result.push({
        id: parseInt(learnerId),
        avg: avg.toFixed(3),
        ...individualScores,
      });
    }

    return result;
  } catch (error) {
    console.error("An error occurred:", error.message);
    return null;
  }
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);
