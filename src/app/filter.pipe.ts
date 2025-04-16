import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }
    return items.filter(item => 
      item.userId.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}
