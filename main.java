
import java.util.*;

class Main{
    public static void main(String[] args)
    {
        int n;
        TreeMap<Integer, String> p1 = new TreeMap<Integer, String> ();
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int num;;
        String name;
        for(int i = 0; i<n ; i++)
        {
            num = sc.nextInt();
            name = sc.next();
            p1.put(num,name);
        }
        NavigableMap<Integer, String> rank = p1.descendingMap();
        int count = 0;
        for(NavigableMap.Entry<Integer, String> var: Rank.entrySet())
        {
            count++;
            String c = Integer.toString(count);
            System.out.println("Rank"+ c + ": " + var.getValue());
        }

    }
}