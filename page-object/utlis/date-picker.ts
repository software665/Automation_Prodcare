import { Page, Locator, expect } from '@playwright/test';

export class DatePickerComponent {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async selectDate(
        dateStr: string,inputSelector: string): Promise<void> {

        const dateInput = this.page.locator(inputSelector);

        await expect(dateInput).toBeVisible();
        await expect(dateInput).toBeEnabled();

        await dateInput.click();

        const calendarContainer =
            this.page.locator('.react-datepicker.custom-calendar');

        await expect(calendarContainer).toBeVisible();

        const monthYearLabel =
            calendarContainer.locator('.chy-label');

        const prevMonthBtn =
            calendarContainer.locator('.chy-nav-btn').first();

        const nextMonthBtn =
            calendarContainer.locator('.chy-nav-btn').last();

        const { day, month, year } =
            this.parseDate(dateStr);

        await this.navigateToMonth(
            calendarContainer,
            monthYearLabel,
            prevMonthBtn,
            nextMonthBtn,
            month,
            year
        );

        const dayClass =
            `.react-datepicker__day--${String(day).padStart(3, '0')}`;

        const dayCell =
            calendarContainer.locator(
                `${dayClass}:not(.react-datepicker__day--outside-month)`
            );

        await expect(dayCell).toBeVisible();

        await dayCell.click();
    }

    private parseDate(
        dateStr: string
    ): {
        day: number;
        month: number;
        year: number;
    } {

        const match =
            /^(\d{2})-(\d{2})-(\d{4})$/.exec(dateStr);

        if (!match) {
            throw new Error(
                `Invalid date "${dateStr}". Expected DD-MM-YYYY`
            );
        }

        return {
            day: Number(match[1]),
            month: Number(match[2]),
            year: Number(match[3])
        };
    }

    private async navigateToMonth(
        calendarContainer: Locator,
        monthYearLabel: Locator,
        prevMonthBtn: Locator,
        nextMonthBtn: Locator,
        targetMonth: number,
        targetYear: number
    ): Promise<void> {

        const monthMap: Record<string, number> = {
            Jan: 1,
            Feb: 2,
            Mar: 3,
            Apr: 4,
            May: 5,
            Jun: 6,
            Jul: 7,
            Aug: 8,
            Sep: 9,
            Oct: 10,
            Nov: 11,
            Dec: 12
        };

        const label =
            await monthYearLabel.textContent();

        if (!label) {
            throw new Error(
                'Calendar month label not found'
            );
        }

        const [monthName, yearText] =
            label.trim().split(/\s+/);

        const currentMonth =
            monthMap[monthName];

        const currentYear =
            Number(yearText);

        const currentIndex =
            currentYear * 12 + currentMonth;

        const targetIndex =
            targetYear * 12 + targetMonth;

        const steps =
            targetIndex - currentIndex;

        const button =
            steps > 0
                ? nextMonthBtn
                : prevMonthBtn;

        for (
            let i = 0;
            i < Math.abs(steps);
            i++
        ) {
            await button.click();
        }
    }
}