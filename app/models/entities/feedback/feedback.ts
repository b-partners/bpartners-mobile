import { Instance, SnapshotIn, SnapshotOut, types } from 'mobx-state-tree';

export const FeedbackModel = types.model('Feedback').props({
  feedbackLink: types.maybeNull(types.string),
});

export interface Feedback extends Instance<typeof FeedbackModel> {}

export interface FeedbackSnapshotOut extends SnapshotOut<typeof FeedbackModel> {}

export interface FeedbackSnapshotIn extends SnapshotIn<typeof FeedbackModel> {}

export const createFeedbackDefaultModel = () =>
  types.optional(FeedbackModel, {
    feedbackLink: null,
  });
