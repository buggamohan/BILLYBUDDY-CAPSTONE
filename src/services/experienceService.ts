import { db } from './db';
import { Experience, Comment } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const experienceService = {
  async getAllExperiences() {
    try {
      const experiences = await db.experiences.toArray();
      return experiences.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('Error fetching experiences:', error);
      throw new Error('Failed to fetch experiences');
    }
  },

  async addExperience(experienceData: Omit<Experience, 'id' | 'timestamp' | 'status' | 'comments' | 'likes'>) {
    try {
      const newExperience: Experience = {
        id: uuidv4(),
        timestamp: new Date(),
        status: 'pending',
        comments: [],
        likes: 0,
        ...experienceData
      };
      await db.experiences.add(newExperience);
      return newExperience;
    } catch (error) {
      console.error('Error adding experience:', error);
      throw new Error('Failed to add experience');
    }
  },

  async addComment(experienceId: string, commentData: Omit<Comment, 'id' | 'timestamp'>) {
    try {
      const experience = await db.experiences.get(experienceId);
      if (!experience) throw new Error('Experience not found');

      const newComment: Comment = {
        id: uuidv4(),
        timestamp: new Date(),
        ...commentData,
        likes: 0
      };

      experience.comments = [...(experience.comments || []), newComment];
      await db.experiences.update(experienceId, experience);
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw new Error('Failed to add comment');
    }
  },

  async likeExperience(experienceId: string) {
    try {
      const experience = await db.experiences.get(experienceId);
      if (!experience) throw new Error('Experience not found');

      experience.likes = (experience.likes || 0) + 1;
      await db.experiences.update(experienceId, experience);
      return experience.likes;
    } catch (error) {
      console.error('Error liking experience:', error);
      throw new Error('Failed to like experience');
    }
  },

  async likeComment(experienceId: string, commentId: string) {
    try {
      const experience = await db.experiences.get(experienceId);
      if (!experience) throw new Error('Experience not found');

      const commentIndex = experience.comments.findIndex(c => c.id === commentId);
      if (commentIndex === -1) throw new Error('Comment not found');

      experience.comments[commentIndex].likes += 1;
      await db.experiences.update(experienceId, experience);
      return experience.comments[commentIndex].likes;
    } catch (error) {
      console.error('Error liking comment:', error);
      throw new Error('Failed to like comment');
    }
  },

  async getExperiencesByUser(userId: string) {
    try {
      const experiences = await db.experiences
        .where('userId')
        .equals(userId)
        .toArray();
      return experiences.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('Error fetching user experiences:', error);
      throw new Error('Failed to fetch user experiences');
    }
  },

  async updateExperienceStatus(id: string, status: 'approved' | 'rejected') {
    try {
      await db.experiences.update(id, { status });
    } catch (error) {
      console.error('Error updating experience status:', error);
      throw new Error('Failed to update experience status');
    }
  }
};