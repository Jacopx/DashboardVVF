import { useState } from 'react'
import { it } from 'date-fns/locale'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'


export function DatePicker({ value, onChange }) {
    const date = value ? new Date(value) : undefined
    const [month, setMonth] = useState(date ?? new Date())

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-left font-normal text-sm p-0 h-auto"
                >
                    {date ? format(date, 'yyyy-MM-dd') : <span className="text-muted-foreground">Seleziona data</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    month={month}
                    onMonthChange={setMonth}
                    onSelect={d => onChange(d ? format(d, 'yyyy-MM-dd') : '')}
                    captionLayout="dropdown"
                    fromYear={2000}
                    toYear={2040}
                    locale={it}
                />
            </PopoverContent>
        </Popover>
    )
}