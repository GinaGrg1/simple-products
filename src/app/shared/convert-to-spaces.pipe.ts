import { Pipe, PipeTransform } from "@angular/core";

// This name will be what will be referenced in the html file.
@Pipe({
    name: 'convertToSlash'
})
export class ConvertToSlash implements PipeTransform {
    transform(value: string, character: string) {
        return value.replace(character, '/');
    }
} 