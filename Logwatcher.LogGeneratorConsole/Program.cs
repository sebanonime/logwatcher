// See https://aka.ms/new-console-template for more information

long count = 0;
int speed = 1000;
StreamWriter outputFile = new StreamWriter("LogwatcherFileTester.txt", true);
var timer = new Timer(OnTimerEllapsed, null, 0, speed);

while (true)
{    
    Console.WriteLine($"Speed: {speed}");
    var cmd = Console.ReadLine();
    if (int.TryParse(cmd, out speed))
    {
        timer.Change(0, speed);
    }
}

void OnTimerEllapsed(object? state)
{
    outputFile.WriteLine( $"{DateTime.Now.ToString("T")} - {count} - This is a sentence to test my new logwatcher wpf.");
    outputFile.Flush();
    count++;
}