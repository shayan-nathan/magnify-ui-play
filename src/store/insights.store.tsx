import { action, makeAutoObservable, observable, runInAction } from 'mobx'
import { API } from '../api/api'
import { Insight } from 'models/insights'
export class InsightsStore {
  insights: Insight[] = [
    {
      title: 'Personalize onboarding experience',
      description: 'Users who complete onboarding modules 1-3 engage 30% more with the app over the first 3 months.',
      id: '1',
      sources: ['Marketo', 'Pendo', 'Intercom', 'Gainsight'],
      start_date: '2021-09-27T14:29:35.340Z',
    },
    {
      title: 'Introduce in-product self-help resources',
      description: 'Users waiting on support ticket resolution for more than 5 days are 15% more likely to churn.',
      id: '2',
      sources: ['Skilljar', 'Pendo', 'Gainsight'],
      start_date: '2022-04-19T14:29:35.340Z',
    },
    {
      title: 'Increase feature adoption: First Transaction',
      id: '3',
      description:
        'Users that do not complete their first transaction in 4 weeks of onboarding are 40% more likely to churn in the next 6 months.',
      sources: ['Intercom', 'Gainsight', 'Pendo'],
      start_date: '2022-04-18T14:29:35.340Z',
    },
  ]
  isLoading = false

  constructor() {
    makeAutoObservable(this, {
      insights: observable,
      isLoading: observable,
      set: action,
    })
  }

  set({ insights, isLoading }: { insights: Insight[]; isLoading: boolean }): void {
    this.insights = insights
    this.isLoading = isLoading
  }

  getAll = async (): Promise<void> => {
    this.isLoading = true
    const insights = await API.insights.getAll()
    runInAction(() => {
      this.insights = insights
      this.isLoading = !this.isLoading
    })
  }
}
