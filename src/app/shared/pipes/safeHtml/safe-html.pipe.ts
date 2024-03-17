import { DomSanitizer } from '@angular/platform-browser'
import { PipeTransform, Pipe } from "@angular/core";

/**
 * @name
 * safeHtml
 * @description
 * Pipe para sanitizar el contenido HTML y evitar ataques XSS
 * @example
 * <div [innerHTML]="html | safeHtml"></div>
 */
@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private sanitized: DomSanitizer) { }

  transform(value: any) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
