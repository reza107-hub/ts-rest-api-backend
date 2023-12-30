import { Schema, model } from 'mongoose';
import { TCourse, TTag } from './course.interface';

const tagSchema = new Schema<TTag>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  isDeleted: {
    type: Boolean,
    required: true,
  },
});

const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    instructor: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    tags: [tagSchema],
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    details: {
      level: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
        trim: true,
      },
     
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: true
  },
);

courseSchema.virtual('durationInWeeks').get(function () {
  const startDate = new Date(this.startDate);
  const endDate = new Date(this.endDate);
  const timeDifference = endDate.getTime() - startDate.getTime();
  const durationInWeeks = Math.ceil(timeDifference / (7 * 24 * 60 * 60 * 1000));
  return durationInWeeks;
});
export const Course = model<TCourse>('Course', courseSchema);
