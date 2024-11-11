import { Pipe, PipeTransform } from '@angular/core';
import { Story } from '../interfaces/API/story.interface';

@Pipe({
    name: 'sortStories',
    standalone: true,
})
export class SortStoriesPipe implements PipeTransform {
    transform(
        stories: Story[],
        sortBy: keyof Story = 'createdAt',
        ascending: boolean = true
    ): Story[] {
        if (!stories || stories.length === 0) {
            return stories;
        }

        return stories.sort((a, b) => {
            let comparison = this.compare(a[sortBy], b[sortBy]);

            if (comparison === 0 && sortBy !== 'estimatedPoint') {
                comparison = this.compare(a['estimatedPoint'], b['estimatedPoint']);
            }
            return ascending ? comparison : -comparison;
        });
    }

    private compare(aValue: any, bValue: any): number {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
    }
}
